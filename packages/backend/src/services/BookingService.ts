import { Booking, Workspace, Member } from '../types/models';
import BookingRepository from '../repositories/BookingRepository';
import WorkspaceRepository from '../repositories/WorkspaceRepository';
import MemberRepository from '../repositories/MemberRepository';
import { transaction } from '../db/query';

export interface BookingAvailability {
  available: boolean;
  conflicts: Booking[];
}

export interface PricingCalculation {
  basePrice: number;
  discount: number;
  totalAmount: number;
  scholarshipApplied: boolean;
}

export class BookingService {
  /**
   * Check if a workspace is available for booking
   */
  async checkAvailability(
    workspaceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<BookingAvailability> {
    const conflicts = await BookingRepository.findOverlapping(
      workspaceId,
      startTime,
      endTime,
      excludeBookingId
    );

    return {
      available: conflicts.length === 0,
      conflicts,
    };
  }

  /**
   * Calculate booking price with scholarship discount
   */
  async calculatePrice(
    workspace: Workspace,
    bookingType: Booking['bookingType'],
    startTime: Date,
    endTime: Date,
    memberId: string
  ): Promise<PricingCalculation> {
    const member = await MemberRepository.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    let basePrice = 0;
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    switch (bookingType) {
      case 'hourly':
        basePrice = workspace.hourlyRate * durationHours;
        break;
      case 'daily':
        const days = Math.ceil(durationHours / 24);
        basePrice = workspace.dailyRate * days;
        break;
      case 'monthly':
        const months = Math.ceil(durationHours / (24 * 30));
        basePrice = workspace.monthlyRate * months;
        break;
    }

    // Apply scholarship discount (30% off)
    const discount = member.scholarshipStatus ? basePrice * 0.3 : 0;
    const totalAmount = basePrice - discount;

    return {
      basePrice,
      discount,
      totalAmount,
      scholarshipApplied: member.scholarshipStatus,
    };
  }

  /**
   * Create a new booking
   */
  async createBooking(data: {
    memberId: string;
    workspaceId: string;
    startTime: Date;
    endTime: Date;
    bookingType: Booking['bookingType'];
  }): Promise<Booking> {
    return transaction(async (client) => {
      // Check workspace exists and is available
      const workspace = await WorkspaceRepository.findById(data.workspaceId);
      if (!workspace) {
        throw new Error('Workspace not found');
      }

      if (!workspace.isAvailable || workspace.maintenanceStatus !== 'operational') {
        throw new Error('Workspace is not available for booking');
      }

      // Check for conflicts
      const availability = await this.checkAvailability(
        data.workspaceId,
        data.startTime,
        data.endTime
      );

      if (!availability.available) {
        throw new Error('Workspace is already booked for this time period');
      }

      // Calculate price
      const pricing = await this.calculatePrice(
        workspace,
        data.bookingType,
        data.startTime,
        data.endTime,
        data.memberId
      );

      // Create booking
      const booking = await BookingRepository.create({
        memberId: data.memberId,
        workspaceId: data.workspaceId,
        startTime: data.startTime,
        endTime: data.endTime,
        bookingType: data.bookingType,
        status: 'confirmed',
        totalAmount: pricing.totalAmount,
        paymentStatus: 'pending',
        paymentId: null,
        cancelledAt: null,
      });

      return booking;
    });
  }

  /**
   * Create a trial booking for first-time users
   */
  async createTrialBooking(memberId: string, workspaceId: string, startTime: Date): Promise<Booking> {
    // Check if member has any previous bookings
    const previousBookings = await BookingRepository.findByMemberId(memberId);
    if (previousBookings.length > 0) {
      throw new Error('Trial bookings are only available for first-time users');
    }

    // Trial booking is 4 hours
    const endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);

    // Check availability
    const availability = await this.checkAvailability(workspaceId, startTime, endTime);
    if (!availability.available) {
      throw new Error('Workspace is not available for trial booking');
    }

    // Create complimentary booking
    const booking = await BookingRepository.create({
      memberId,
      workspaceId,
      startTime,
      endTime,
      bookingType: 'hourly',
      status: 'confirmed',
      totalAmount: 0, // Complimentary
      paymentStatus: 'paid',
      paymentId: null,
      cancelledAt: null,
    });

    return booking;
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<{ booking: Booking; refundAmount: number }> {
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    if (booking.status === 'completed') {
      throw new Error('Cannot cancel a completed booking');
    }

    const now = new Date();
    const hoursUntilStart = (booking.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Full refund if cancelled more than 24 hours in advance
    const refundAmount = hoursUntilStart > 24 ? booking.totalAmount : 0;

    const updatedBooking = await BookingRepository.update(bookingId, {
      status: 'cancelled',
      cancelledAt: now,
      paymentStatus: refundAmount > 0 ? 'refunded' : booking.paymentStatus,
    });

    if (!updatedBooking) {
      throw new Error('Failed to cancel booking');
    }

    return {
      booking: updatedBooking,
      refundAmount,
    };
  }

  /**
   * Update booking payment status
   */
  async updatePaymentStatus(
    bookingId: string,
    paymentStatus: Booking['paymentStatus'],
    paymentId?: string
  ): Promise<Booking> {
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const updates: Partial<Booking> = { paymentStatus };
    if (paymentId) {
      updates.paymentId = paymentId;
    }

    const updatedBooking = await BookingRepository.update(bookingId, updates);
    if (!updatedBooking) {
      throw new Error('Failed to update payment status');
    }

    return updatedBooking;
  }

  /**
   * Check in to a booking
   */
  async checkIn(bookingId: string): Promise<Booking> {
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== 'confirmed') {
      throw new Error('Only confirmed bookings can be checked in');
    }

    if (booking.paymentStatus !== 'paid') {
      throw new Error('Payment must be completed before check-in');
    }

    const now = new Date();
    if (now < booking.startTime) {
      throw new Error('Cannot check in before booking start time');
    }

    if (now > booking.endTime) {
      throw new Error('Booking has expired');
    }

    const updatedBooking = await BookingRepository.update(bookingId, {
      status: 'checked-in',
    });

    if (!updatedBooking) {
      throw new Error('Failed to check in');
    }

    return updatedBooking;
  }

  /**
   * Complete a booking
   */
  async completeBooking(bookingId: string): Promise<Booking> {
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'completed') {
      return booking;
    }

    const updatedBooking = await BookingRepository.update(bookingId, {
      status: 'completed',
    });

    if (!updatedBooking) {
      throw new Error('Failed to complete booking');
    }

    return updatedBooking;
  }

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking | null> {
    return BookingRepository.findById(bookingId);
  }

  /**
   * Get member bookings
   */
  async getMemberBookings(memberId: string): Promise<Booking[]> {
    return BookingRepository.findByMemberId(memberId);
  }

  /**
   * Get workspace bookings
   */
  async getWorkspaceBookings(workspaceId: string): Promise<Booking[]> {
    return BookingRepository.findByWorkspaceId(workspaceId);
  }

  /**
   * Get active booking for a workspace at current time
   */
  async getActiveBooking(workspaceId: string): Promise<Booking | null> {
    const now = new Date();
    const bookings = await BookingRepository.findOverlapping(
      workspaceId,
      now,
      now
    );

    return bookings.length > 0 ? bookings[0] : null;
  }
}

export default new BookingService();

import { Payment, Booking, Member } from '../types/models';
import PaymentRepository from '../repositories/PaymentRepository';
import BookingService from './BookingService';
import MemberRepository from '../repositories/MemberRepository';
import { transaction } from '../db/query';

export interface PaymentGatewayResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class PaymentService {
  /**
   * Process payment for a booking
   */
  async processBookingPayment(
    bookingId: string,
    paymentMethod: Payment['paymentMethod'],
    currency: string = 'USD'
  ): Promise<Payment> {
    return transaction(async () => {
      const booking = await BookingService.getBooking(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.paymentStatus === 'paid') {
        throw new Error('Booking is already paid');
      }

      // Create payment record
      const payment = await PaymentRepository.create({
        memberId: booking.memberId,
        amount: booking.totalAmount,
        currency,
        paymentMethod,
        paymentType: 'booking',
        referenceId: bookingId,
        status: 'pending',
        transactionId: null,
        completedAt: null,
      });

      // Process payment with gateway
      const gatewayResponse = await this.processWithGateway(
        payment.amount,
        paymentMethod,
        currency
      );

      if (!gatewayResponse.success) {
        await PaymentRepository.update(payment.id, {
          status: 'failed',
        });
        throw new Error(gatewayResponse.error || 'Payment processing failed');
      }

      // Update payment status
      const completedPayment = await PaymentRepository.update(payment.id, {
        status: 'completed',
        transactionId: gatewayResponse.transactionId || null,
        completedAt: new Date(),
      });

      if (!completedPayment) {
        throw new Error('Failed to update payment status');
      }

      // Update booking payment status
      await BookingService.updatePaymentStatus(bookingId, 'paid', completedPayment.id);

      return completedPayment;
    });
  }

  /**
   * Process membership payment
   */
  async processMembershipPayment(
    memberId: string,
    amount: number,
    paymentMethod: Payment['paymentMethod'],
    currency: string = 'USD'
  ): Promise<Payment> {
    return transaction(async () => {
      const member = await MemberRepository.findById(memberId);
      if (!member) {
        throw new Error('Member not found');
      }

      // Create payment record
      const payment = await PaymentRepository.create({
        memberId,
        amount,
        currency,
        paymentMethod,
        paymentType: 'membership',
        referenceId: `membership-${memberId}-${Date.now()}`,
        status: 'pending',
        transactionId: null,
        completedAt: null,
      });

      // Process payment with gateway
      const gatewayResponse = await this.processWithGateway(amount, paymentMethod, currency);

      if (!gatewayResponse.success) {
        await PaymentRepository.update(payment.id, {
          status: 'failed',
        });
        throw new Error(gatewayResponse.error || 'Payment processing failed');
      }

      // Update payment status
      const completedPayment = await PaymentRepository.update(payment.id, {
        status: 'completed',
        transactionId: gatewayResponse.transactionId || null,
        completedAt: new Date(),
      });

      if (!completedPayment) {
        throw new Error('Failed to update payment status');
      }

      return completedPayment;
    });
  }

  /**
   * Process refund
   */
  async processRefund(paymentId: string, amount?: number): Promise<Payment> {
    const payment = await PaymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount) {
      throw new Error('Refund amount cannot exceed original payment amount');
    }

    // Process refund with gateway
    const gatewayResponse = await this.processRefundWithGateway(
      payment.transactionId || '',
      refundAmount
    );

    if (!gatewayResponse.success) {
      throw new Error(gatewayResponse.error || 'Refund processing failed');
    }

    // Update payment status
    const refundedPayment = await PaymentRepository.update(paymentId, {
      status: 'refunded',
    });

    if (!refundedPayment) {
      throw new Error('Failed to update payment status');
    }

    return refundedPayment;
  }

  /**
   * Handle payment webhook from gateway
   */
  async handleWebhook(
    transactionId: string,
    status: 'completed' | 'failed',
    metadata?: any
  ): Promise<void> {
    const payment = await PaymentRepository.findByTransactionId(transactionId);
    if (!payment) {
      console.warn(`Payment not found for transaction ${transactionId}`);
      return;
    }

    if (status === 'completed') {
      await PaymentRepository.update(payment.id, {
        status: 'completed',
        completedAt: new Date(),
      });

      // Update related booking if applicable
      if (payment.paymentType === 'booking') {
        await BookingService.updatePaymentStatus(payment.referenceId, 'paid', payment.id);
      }
    } else {
      await PaymentRepository.update(payment.id, {
        status: 'failed',
      });
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment | null> {
    return PaymentRepository.findById(paymentId);
  }

  /**
   * Get member payments
   */
  async getMemberPayments(memberId: string): Promise<Payment[]> {
    return PaymentRepository.findByMemberId(memberId);
  }

  /**
   * Get revenue by type
   */
  async getRevenueByType(startDate: Date, endDate: Date): Promise<Array<{
    paymentType: string;
    totalRevenue: number;
  }>> {
    return PaymentRepository.getRevenueByType(startDate, endDate);
  }

  /**
   * Get total revenue
   */
  async getTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
    return PaymentRepository.getTotalRevenue(startDate, endDate);
  }

  /**
   * Generate invoice
   */
  async generateInvoice(paymentId: string): Promise<{
    invoiceNumber: string;
    payment: Payment;
    member: Member;
    generatedAt: Date;
  }> {
    const payment = await PaymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    const member = await MemberRepository.findById(payment.memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    return {
      invoiceNumber: `INV-${payment.id.substring(0, 8).toUpperCase()}`,
      payment,
      member,
      generatedAt: new Date(),
    };
  }

  /**
   * Process payment with gateway (mock implementation)
   * In production, this would integrate with Flutterwave, Paystack, etc.
   */
  private async processWithGateway(
    amount: number,
    paymentMethod: Payment['paymentMethod'],
    currency: string
  ): Promise<PaymentGatewayResponse> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success (95% success rate)
    const success = Math.random() < 0.95;

    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };
    } else {
      return {
        success: false,
        error: 'Payment declined by gateway',
      };
    }
  }

  /**
   * Process refund with gateway (mock implementation)
   */
  private async processRefundWithGateway(
    transactionId: string,
    amount: number
  ): Promise<PaymentGatewayResponse> {
    // Simulate refund processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success (98% success rate)
    const success = Math.random() < 0.98;

    if (success) {
      return {
        success: true,
        transactionId: `refund_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };
    } else {
      return {
        success: false,
        error: 'Refund processing failed',
      };
    }
  }

  /**
   * Retry failed payment with exponential backoff
   */
  async retryPayment(paymentId: string, maxRetries: number = 3): Promise<Payment> {
    const payment = await PaymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'failed') {
      throw new Error('Only failed payments can be retried');
    }

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Exponential backoff: 2^attempt seconds
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        const gatewayResponse = await this.processWithGateway(
          payment.amount,
          payment.paymentMethod,
          payment.currency
        );

        if (gatewayResponse.success) {
          const completedPayment = await PaymentRepository.update(paymentId, {
            status: 'completed',
            transactionId: gatewayResponse.transactionId || null,
            completedAt: new Date(),
          });

          if (!completedPayment) {
            throw new Error('Failed to update payment status');
          }

          return completedPayment;
        }

        lastError = new Error(gatewayResponse.error || 'Payment processing failed');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Payment retry attempt ${attempt} failed:`, lastError);
      }
    }

    throw lastError || new Error('Payment retry failed after maximum attempts');
  }
}

export default new PaymentService();

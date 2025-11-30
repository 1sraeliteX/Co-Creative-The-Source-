import { Router } from 'express';
import BookingService from '../services/BookingService';
import WorkspaceRepository from '../repositories/WorkspaceRepository';

const router = Router();

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', async (req, res) => {
  try {
    const { memberId, workspaceId, startTime, endTime, bookingType } = req.body;

    if (!memberId || !workspaceId || !startTime || !endTime || !bookingType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = await BookingService.createBooking({
      memberId,
      workspaceId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      bookingType,
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to create booking' 
    });
  }
});

/**
 * POST /api/bookings/trial
 * Create a trial booking for first-time users
 */
router.post('/trial', async (req, res) => {
  try {
    const { memberId, workspaceId, startTime } = req.body;

    if (!memberId || !workspaceId || !startTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = await BookingService.createTrialBooking(
      memberId,
      workspaceId,
      new Date(startTime)
    );

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Error creating trial booking:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to create trial booking' 
    });
  }
});

/**
 * GET /api/bookings/:id
 * Get booking by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingService.getBooking(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

/**
 * GET /api/bookings/member/:memberId
 * Get all bookings for a member
 */
router.get('/member/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const bookings = await BookingService.getMemberBookings(memberId);

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching member bookings:', error);
    res.status(500).json({ error: 'Failed to fetch member bookings' });
  }
});

/**
 * GET /api/bookings/workspace/:workspaceId
 * Get all bookings for a workspace
 */
router.get('/workspace/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const bookings = await BookingService.getWorkspaceBookings(workspaceId);

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching workspace bookings:', error);
    res.status(500).json({ error: 'Failed to fetch workspace bookings' });
  }
});

/**
 * POST /api/bookings/:id/check-in
 * Check in to a booking
 */
router.post('/:id/check-in', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingService.checkIn(id);

    res.json({ booking });
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to check in' 
    });
  }
});

/**
 * POST /api/bookings/:id/cancel
 * Cancel a booking
 */
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BookingService.cancelBooking(id);

    res.json(result);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to cancel booking' 
    });
  }
});

/**
 * POST /api/bookings/:id/complete
 * Complete a booking
 */
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingService.completeBooking(id);

    res.json({ booking });
  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to complete booking' 
    });
  }
});

/**
 * PATCH /api/bookings/:id/payment
 * Update booking payment status
 */
router.patch('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentId } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ error: 'Payment status is required' });
    }

    const booking = await BookingService.updatePaymentStatus(id, paymentStatus, paymentId);

    res.json({ booking });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to update payment status' 
    });
  }
});

/**
 * POST /api/bookings/check-availability
 * Check if a workspace is available
 */
router.post('/check-availability', async (req, res) => {
  try {
    const { workspaceId, startTime, endTime, excludeBookingId } = req.body;

    if (!workspaceId || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const availability = await BookingService.checkAvailability(
      workspaceId,
      new Date(startTime),
      new Date(endTime),
      excludeBookingId
    );

    res.json(availability);
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

/**
 * POST /api/bookings/calculate-price
 * Calculate booking price
 */
router.post('/calculate-price', async (req, res) => {
  try {
    const { workspaceId, bookingType, startTime, endTime, memberId } = req.body;

    if (!workspaceId || !bookingType || !startTime || !endTime || !memberId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const pricing = await BookingService.calculatePrice(
      workspace,
      bookingType,
      new Date(startTime),
      new Date(endTime),
      memberId
    );

    res.json(pricing);
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to calculate price' 
    });
  }
});

export default router;

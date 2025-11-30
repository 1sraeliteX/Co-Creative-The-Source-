import { Router } from 'express';
import PaymentService from '../services/PaymentService';

const router = Router();

/**
 * POST /api/payments/booking
 * Process payment for a booking
 */
router.post('/booking', async (req, res) => {
  try {
    const { bookingId, paymentMethod, currency } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payment = await PaymentService.processBookingPayment(
      bookingId,
      paymentMethod,
      currency
    );

    res.status(201).json({ payment });
  } catch (error) {
    console.error('Error processing booking payment:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to process payment',
    });
  }
});

/**
 * POST /api/payments/membership
 * Process membership payment
 */
router.post('/membership', async (req, res) => {
  try {
    const { memberId, amount, paymentMethod, currency } = req.body;

    if (!memberId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payment = await PaymentService.processMembershipPayment(
      memberId,
      amount,
      paymentMethod,
      currency
    );

    res.status(201).json({ payment });
  } catch (error) {
    console.error('Error processing membership payment:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to process payment',
    });
  }
});

/**
 * POST /api/payments/:id/refund
 * Process refund for a payment
 */
router.post('/:id/refund', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const payment = await PaymentService.processRefund(id, amount);

    res.json({ payment });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to process refund',
    });
  }
});

/**
 * POST /api/payments/:id/retry
 * Retry a failed payment
 */
router.post('/:id/retry', async (req, res) => {
  try {
    const { id } = req.params;
    const { maxRetries } = req.body;

    const payment = await PaymentService.retryPayment(id, maxRetries);

    res.json({ payment });
  } catch (error) {
    console.error('Error retrying payment:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to retry payment',
    });
  }
});

/**
 * GET /api/payments/:id
 * Get payment by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await PaymentService.getPayment(id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

/**
 * GET /api/payments/member/:memberId
 * Get all payments for a member
 */
router.get('/member/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const payments = await PaymentService.getMemberPayments(memberId);

    res.json({ payments });
  } catch (error) {
    console.error('Error fetching member payments:', error);
    res.status(500).json({ error: 'Failed to fetch member payments' });
  }
});

/**
 * GET /api/payments/:id/invoice
 * Generate invoice for a payment
 */
router.get('/:id/invoice', async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await PaymentService.generateInvoice(id);

    res.json({ invoice });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to generate invoice',
    });
  }
});

/**
 * GET /api/payments/revenue/by-type
 * Get revenue breakdown by payment type
 */
router.get('/revenue/by-type', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const revenue = await PaymentService.getRevenueByType(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({ revenue });
  } catch (error) {
    console.error('Error fetching revenue by type:', error);
    res.status(500).json({ error: 'Failed to fetch revenue by type' });
  }
});

/**
 * GET /api/payments/revenue/total
 * Get total revenue
 */
router.get('/revenue/total', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const total = await PaymentService.getTotalRevenue(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({ total });
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    res.status(500).json({ error: 'Failed to fetch total revenue' });
  }
});

/**
 * POST /api/payments/webhook
 * Handle payment gateway webhook
 */
router.post('/webhook', async (req, res) => {
  try {
    const { transactionId, status, metadata } = req.body;

    if (!transactionId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await PaymentService.handleWebhook(transactionId, status, metadata);

    res.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Failed to handle webhook' });
  }
});

export default router;

import { Booking, Member, Workspace } from '../types/models';

export interface Notification {
  id: string;
  recipientId: string;
  type: 'booking-confirmation' | 'booking-reminder' | 'booking-cancelled' | 'payment-received';
  subject: string;
  message: string;
  sentAt: Date;
  channel: 'email' | 'sms' | 'in-app';
}

export class NotificationService {
  private notifications: Notification[] = [];

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(
    booking: Booking,
    member: Member,
    workspace: Workspace
  ): Promise<void> {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      recipientId: member.id,
      type: 'booking-confirmation',
      subject: 'Booking Confirmed - The Source HUB',
      message: `Hi ${member.name},\n\nYour booking for ${workspace.name} has been confirmed!\n\nDetails:\n- Start: ${booking.startTime.toLocaleString()}\n- End: ${booking.endTime.toLocaleString()}\n- Total: $${booking.totalAmount}\n\nBooking ID: ${booking.id}\n\nSee you soon!\nThe Source HUB Team`,
      sentAt: new Date(),
      channel: 'email',
    };

    this.notifications.push(notification);
    console.log(`📧 Booking confirmation sent to ${member.email}`);
  }

  /**
   * Send booking reminder (24 hours before)
   */
  async sendBookingReminder(
    booking: Booking,
    member: Member,
    workspace: Workspace
  ): Promise<void> {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      recipientId: member.id,
      type: 'booking-reminder',
      subject: 'Booking Reminder - The Source HUB',
      message: `Hi ${member.name},\n\nThis is a reminder that your booking for ${workspace.name} starts tomorrow at ${booking.startTime.toLocaleString()}.\n\nBooking ID: ${booking.id}\n\nLooking forward to seeing you!\nThe Source HUB Team`,
      sentAt: new Date(),
      channel: 'email',
    };

    this.notifications.push(notification);
    console.log(`📧 Booking reminder sent to ${member.email}`);
  }

  /**
   * Send cancellation notification
   */
  async sendCancellationNotification(
    booking: Booking,
    member: Member,
    workspace: Workspace,
    refundAmount: number
  ): Promise<void> {
    const refundMessage = refundAmount > 0
      ? `A refund of $${refundAmount} will be processed within 5-7 business days.`
      : 'No refund is applicable for this cancellation.';

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      recipientId: member.id,
      type: 'booking-cancelled',
      subject: 'Booking Cancelled - The Source HUB',
      message: `Hi ${member.name},\n\nYour booking for ${workspace.name} has been cancelled.\n\n${refundMessage}\n\nBooking ID: ${booking.id}\n\nWe hope to see you again soon!\nThe Source HUB Team`,
      sentAt: new Date(),
      channel: 'email',
    };

    this.notifications.push(notification);
    console.log(`📧 Cancellation notification sent to ${member.email}`);
  }

  /**
   * Send payment received notification
   */
  async sendPaymentReceived(
    booking: Booking,
    member: Member,
    amount: number
  ): Promise<void> {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      recipientId: member.id,
      type: 'payment-received',
      subject: 'Payment Received - The Source HUB',
      message: `Hi ${member.name},\n\nWe've received your payment of $${amount} for booking ${booking.id}.\n\nThank you!\nThe Source HUB Team`,
      sentAt: new Date(),
      channel: 'email',
    };

    this.notifications.push(notification);
    console.log(`📧 Payment confirmation sent to ${member.email}`);
  }

  /**
   * Get notifications for a member
   */
  getNotifications(memberId: string): Notification[] {
    return this.notifications.filter(n => n.recipientId === memberId);
  }

  /**
   * Schedule booking reminders
   * This would typically run as a cron job
   */
  async scheduleBookingReminders(): Promise<void> {
    // Implementation would check for bookings starting in 24 hours
    // and send reminders
    console.log('Checking for bookings requiring reminders...');
  }
}

export default new NotificationService();

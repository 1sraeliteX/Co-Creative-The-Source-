import { Booking } from '../types/models';
import { query, queryOne, queryMany, toCamelCase, toSnakeCase } from '../db/query';

export class BookingRepository {
  async create(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const snakeData = toSnakeCase(booking);
    const result = await queryOne<any>(
      `INSERT INTO bookings (
        member_id, workspace_id, start_time, end_time, booking_type,
        status, total_amount, payment_status, payment_id, cancelled_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        snakeData.member_id,
        snakeData.workspace_id,
        snakeData.start_time,
        snakeData.end_time,
        snakeData.booking_type,
        snakeData.status,
        snakeData.total_amount,
        snakeData.payment_status,
        snakeData.payment_id,
        snakeData.cancelled_at,
      ]
    );
    return toCamelCase(result) as Booking;
  }

  async findById(id: string): Promise<Booking | null> {
    const result = await queryOne<any>('SELECT * FROM bookings WHERE id = $1', [id]);
    return result ? (toCamelCase(result) as Booking) : null;
  }

  async findByMemberId(memberId: string): Promise<Booking[]> {
    const results = await queryMany<any>(
      'SELECT * FROM bookings WHERE member_id = $1 ORDER BY start_time DESC',
      [memberId]
    );
    return toCamelCase(results) as Booking[];
  }

  async findByWorkspaceId(workspaceId: string): Promise<Booking[]> {
    const results = await queryMany<any>(
      'SELECT * FROM bookings WHERE workspace_id = $1 ORDER BY start_time',
      [workspaceId]
    );
    return toCamelCase(results) as Booking[];
  }

  async findOverlapping(
    workspaceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<Booking[]> {
    const excludeClause = excludeBookingId ? 'AND id != $4' : '';
    const params = excludeBookingId
      ? [workspaceId, startTime, endTime, excludeBookingId]
      : [workspaceId, startTime, endTime];

    const results = await queryMany<any>(
      `SELECT * FROM bookings 
       WHERE workspace_id = $1 
       AND status IN ('confirmed', 'checked-in')
       AND start_time < $3 
       AND end_time > $2
       ${excludeClause}`,
      params
    );
    return toCamelCase(results) as Booking[];
  }

  async update(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const snakeData = toSnakeCase(updates);
    const fields = Object.keys(snakeData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(snakeData);

    const result = await queryOne<any>(
      `UPDATE bookings SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result ? (toCamelCase(result) as Booking) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM bookings WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default new BookingRepository();

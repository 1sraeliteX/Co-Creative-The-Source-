import { Payment } from '../types/models';
import { query, queryOne, queryMany, toCamelCase, toSnakeCase } from '../db/query';

export class PaymentRepository {
  async create(payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
    const snakeData = toSnakeCase(payment);
    const result = await queryOne<any>(
      `INSERT INTO payments (
        member_id, amount, currency, payment_method, payment_type,
        reference_id, status, transaction_id, completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        snakeData.member_id,
        snakeData.amount,
        snakeData.currency,
        snakeData.payment_method,
        snakeData.payment_type,
        snakeData.reference_id,
        snakeData.status,
        snakeData.transaction_id,
        snakeData.completed_at,
      ]
    );
    return toCamelCase(result) as Payment;
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await queryOne<any>('SELECT * FROM payments WHERE id = $1', [id]);
    return result ? (toCamelCase(result) as Payment) : null;
  }

  async findByReferenceId(referenceId: string): Promise<Payment | null> {
    const result = await queryOne<any>(
      'SELECT * FROM payments WHERE reference_id = $1',
      [referenceId]
    );
    return result ? (toCamelCase(result) as Payment) : null;
  }

  async findByMemberId(memberId: string): Promise<Payment[]> {
    const results = await queryMany<any>(
      'SELECT * FROM payments WHERE member_id = $1 ORDER BY created_at DESC',
      [memberId]
    );
    return toCamelCase(results) as Payment[];
  }

  async findByTransactionId(transactionId: string): Promise<Payment | null> {
    const result = await queryOne<any>(
      'SELECT * FROM payments WHERE transaction_id = $1',
      [transactionId]
    );
    return result ? (toCamelCase(result) as Payment) : null;
  }

  async update(id: string, updates: Partial<Payment>): Promise<Payment | null> {
    const snakeData = toSnakeCase(updates);
    const fields = Object.keys(snakeData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(snakeData);

    const result = await queryOne<any>(
      `UPDATE payments SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result ? (toCamelCase(result) as Payment) : null;
  }

  async getRevenueByType(startDate: Date, endDate: Date): Promise<Array<{
    paymentType: string;
    totalRevenue: number;
  }>> {
    const results = await queryMany<any>(
      `SELECT 
        payment_type,
        SUM(amount) as total_revenue
       FROM payments
       WHERE status = 'completed'
       AND created_at >= $1
       AND created_at <= $2
       GROUP BY payment_type`,
      [startDate, endDate]
    );

    return results.map(r => ({
      paymentType: r.payment_type,
      totalRevenue: parseFloat(r.total_revenue),
    }));
  }

  async getTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
    const result = await queryOne<any>(
      `SELECT SUM(amount) as total
       FROM payments
       WHERE status = 'completed'
       AND created_at >= $1
       AND created_at <= $2`,
      [startDate, endDate]
    );

    return result ? parseFloat(result.total || 0) : 0;
  }
}

export default new PaymentRepository();

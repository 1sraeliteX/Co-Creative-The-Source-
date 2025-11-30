import { Member } from '../types/models';
import { query, queryOne, queryMany, toCamelCase, toSnakeCase } from '../db/query';

export class MemberRepository {
  async create(member: Omit<Member, 'id'>): Promise<Member> {
    const snakeData = toSnakeCase(member);
    const result = await queryOne<any>(
      `INSERT INTO members (
        email, name, phone, membership_tier, membership_status,
        join_date, expiry_date, skills, interests, bio, portfolio,
        access_card_id, storage_unit_number, scholarship_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        snakeData.email,
        snakeData.name,
        snakeData.phone,
        snakeData.membership_tier,
        snakeData.membership_status,
        snakeData.join_date,
        snakeData.expiry_date,
        snakeData.skills,
        snakeData.interests,
        snakeData.bio,
        snakeData.portfolio,
        snakeData.access_card_id,
        snakeData.storage_unit_number,
        snakeData.scholarship_status,
      ]
    );
    return toCamelCase(result) as Member;
  }

  async findById(id: string): Promise<Member | null> {
    const result = await queryOne<any>('SELECT * FROM members WHERE id = $1', [id]);
    return result ? (toCamelCase(result) as Member) : null;
  }

  async findByEmail(email: string): Promise<Member | null> {
    const result = await queryOne<any>('SELECT * FROM members WHERE email = $1', [email]);
    return result ? (toCamelCase(result) as Member) : null;
  }

  async findByAccessCardId(accessCardId: string): Promise<Member | null> {
    const result = await queryOne<any>(
      'SELECT * FROM members WHERE access_card_id = $1',
      [accessCardId]
    );
    return result ? (toCamelCase(result) as Member) : null;
  }

  async findAll(): Promise<Member[]> {
    const results = await queryMany<any>('SELECT * FROM members ORDER BY created_at DESC');
    return toCamelCase(results) as Member[];
  }

  async update(id: string, updates: Partial<Member>): Promise<Member | null> {
    const snakeData = toSnakeCase(updates);
    const fields = Object.keys(snakeData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(snakeData);

    const result = await queryOne<any>(
      `UPDATE members SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result ? (toCamelCase(result) as Member) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM members WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async searchBySkills(skills: string[]): Promise<Member[]> {
    const results = await queryMany<any>(
      'SELECT * FROM members WHERE skills && $1 AND membership_status = $2',
      [skills, 'active']
    );
    return toCamelCase(results) as Member[];
  }

  async searchByInterests(interests: string[]): Promise<Member[]> {
    const results = await queryMany<any>(
      'SELECT * FROM members WHERE interests && $1 AND membership_status = $2',
      [interests, 'active']
    );
    return toCamelCase(results) as Member[];
  }
}

export default new MemberRepository();

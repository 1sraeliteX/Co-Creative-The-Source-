import { Workspace } from '../types/models';
import { query, queryOne, queryMany, toCamelCase, toSnakeCase } from '../db/query';

export class WorkspaceRepository {
  async create(workspace: Omit<Workspace, 'id'>): Promise<Workspace> {
    const snakeData = toSnakeCase(workspace);
    const result = await queryOne<any>(
      `INSERT INTO workspaces (
        name, type, capacity, hourly_rate, daily_rate, monthly_rate,
        amenities, equipment, floor, is_available, maintenance_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        snakeData.name,
        snakeData.type,
        snakeData.capacity,
        snakeData.hourly_rate,
        snakeData.daily_rate,
        snakeData.monthly_rate,
        snakeData.amenities,
        snakeData.equipment,
        snakeData.floor,
        snakeData.is_available,
        snakeData.maintenance_status,
      ]
    );
    return toCamelCase(result) as Workspace;
  }

  async findById(id: string): Promise<Workspace | null> {
    const result = await queryOne<any>('SELECT * FROM workspaces WHERE id = $1', [id]);
    return result ? (toCamelCase(result) as Workspace) : null;
  }

  async findAll(): Promise<Workspace[]> {
    const results = await queryMany<any>('SELECT * FROM workspaces ORDER BY name');
    return toCamelCase(results) as Workspace[];
  }

  async findByType(type: Workspace['type']): Promise<Workspace[]> {
    const results = await queryMany<any>('SELECT * FROM workspaces WHERE type = $1', [type]);
    return toCamelCase(results) as Workspace[];
  }

  async findAvailable(): Promise<Workspace[]> {
    const results = await queryMany<any>(
      'SELECT * FROM workspaces WHERE is_available = true AND maintenance_status = $1',
      ['operational']
    );
    return toCamelCase(results) as Workspace[];
  }

  async update(id: string, updates: Partial<Workspace>): Promise<Workspace | null> {
    const snakeData = toSnakeCase(updates);
    const fields = Object.keys(snakeData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(snakeData);

    const result = await queryOne<any>(
      `UPDATE workspaces SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result ? (toCamelCase(result) as Workspace) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM workspaces WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default new WorkspaceRepository();

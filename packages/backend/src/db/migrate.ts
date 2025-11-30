import fs from 'fs';
import path from 'path';
import pool from '../config/database';

interface Migration {
  id: number;
  name: string;
  sql: string;
}

async function createMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedMigrations(): Promise<number[]> {
  const result = await pool.query('SELECT id FROM migrations ORDER BY id');
  return result.rows.map((row) => row.id);
}

async function getMigrationFiles(): Promise<Migration[]> {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  return files.map((file) => {
    const match = file.match(/^(\d+)_(.+)\.sql$/);
    if (!match) {
      throw new Error(`Invalid migration filename: ${file}`);
    }

    const id = parseInt(match[1], 10);
    const name = match[2];
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

    return { id, name, sql };
  });
}

export async function runMigrations() {
  try {
    console.log('Starting database migrations...');

    await createMigrationsTable();
    const executedMigrations = await getExecutedMigrations();
    const allMigrations = await getMigrationFiles();

    const pendingMigrations = allMigrations.filter(
      (m) => !executedMigrations.includes(m.id)
    );

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations.');
      return;
    }

    for (const migration of pendingMigrations) {
      console.log(`Running migration ${migration.id}: ${migration.name}...`);

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(migration.sql);
        await client.query(
          'INSERT INTO migrations (id, name) VALUES ($1, $2)',
          [migration.id, migration.name]
        );
        await client.query('COMMIT');
        console.log(`✓ Migration ${migration.id} completed`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

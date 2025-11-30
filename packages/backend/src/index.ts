import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/database';
import redisClient from './config/redis';
import infrastructureRoutes from './routes/infrastructure';
import bookingRoutes from './routes/bookings';
import workspaceRoutes from './routes/workspaces';
import paymentRoutes from './routes/payments';
import memberRoutes from './routes/members';
import accessRoutes from './routes/access';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/infrastructure', infrastructureRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/access', accessRoutes);

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    const dbStatus = 'connected';

    // Check Redis connection
    const redisStatus = redisClient.isOpen ? 'connected' : 'disconnected';

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      redis: redisStatus,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Initialize connections and start server
async function start() {
  try {
    // Connect to Redis (optional)
    try {
      await redisClient.connect();
      console.log('✓ Redis connected');
    } catch (redisError) {
      console.warn('⚠ Redis connection failed (optional service, continuing...)');
    }

    // Test database connection
    await pool.query('SELECT 1');
    console.log('✓ Database connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Source HUB API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;

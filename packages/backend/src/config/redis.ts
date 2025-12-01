import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    reconnectStrategy: false, // Don't auto-reconnect
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export default redisClient;

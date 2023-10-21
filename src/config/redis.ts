import { createClient } from 'redis';
import { loadEnv } from './envs';
loadEnv();

export const DEFAULT_EXP = 3600;
console.log();

export const redis = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOSTNAME,
    port: Number(process.env.REDIS_PORT),
  },
});

export async function connectRedis(): Promise<void> {
  console.log('Connecting to Redis...');
  await redis.on('error', (err) => console.log('Redis Client Error', err)).connect();
}

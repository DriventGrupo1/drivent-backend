import { createClient } from 'redis';

export const DEFAULT_EXP = 3600;

export let redis = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-14229.c285.us-west-2-2.ec2.cloud.redislabs.com',
    port: 14229,
  },
});

export async function connectRedis(): Promise<void> {
  console.log('Connecting to Redis...');
  await redis.on('error', (err) => console.log('Redis Client Error', err)).connect();
}

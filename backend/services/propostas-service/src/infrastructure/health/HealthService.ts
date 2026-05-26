import { pool } from '../database/connection';
import Redis from 'ioredis';
import { getRabbitMQChannel } from '../messaging/rabbitmq/RabbitMQConnection';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function checkPostgres(): Promise<{ status: string; latency_ms?: number; error?: string }> {
  const start = Date.now();
  try {
    await pool.query('SELECT 1');
    return { status: 'ok', latency_ms: Date.now() - start };
  } catch (err: any) {
    return { status: 'error', error: err.message };
  }
}

async function checkRedis(): Promise<{ status: string; latency_ms?: number; error?: string }> {
  const start = Date.now();
  const client = new Redis(REDIS_URL);
  try {
    await client.ping();
    return { status: 'ok', latency_ms: Date.now() - start };
  } catch (err: any) {
    return { status: 'error', error: err.message };
  } finally {
    client.disconnect();
  }
}

async function checkRabbitMQ(): Promise<{ status: string; error?: string }> {
  try {
    const channel = await getRabbitMQChannel();
    if (channel) return { status: 'ok' };
    return { status: 'error', error: 'Channel não disponível' };
  } catch (err: any) {
    return { status: 'error', error: err.message };
  }
}

export async function getReadinessStatus() {
  const [postgres, redis, rabbitmq] = await Promise.all([
    checkPostgres(),
    checkRedis(),
    checkRabbitMQ(),
  ]);

  const allOk = [postgres, redis, rabbitmq].every(c => c.status === 'ok');

  return {
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    dependencies: { postgres, redis, rabbitmq },
  };
}
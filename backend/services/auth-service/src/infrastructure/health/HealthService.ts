import { pool } from '../database/connection';
import { redisCacheService } from '../cache/RedisCacheService';

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
  try {
    await redisCacheService.set('health:ping', 'pong', 5);
    const result = await redisCacheService.get('health:ping');
    if (result !== 'pong') throw new Error('Valor inesperado no Redis');
    return { status: 'ok', latency_ms: Date.now() - start };
  } catch (err: any) {
    return { status: 'error', error: err.message };
  }
}

export async function getReadinessStatus() {
  const [postgres, redis] = await Promise.all([
    checkPostgres(),
    checkRedis(),
  ]);

  const allOk = postgres.status === 'ok' && redis.status === 'ok';

  return {
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    dependencies: { postgres, redis },
  };
}
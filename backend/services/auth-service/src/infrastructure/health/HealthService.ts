import { pool } from '../database/connection';

async function checkPostgres(): Promise<{ status: string; latency_ms?: number; error?: string }> {
  const start = Date.now();
  try {
    await pool.query('SELECT 1');
    return { status: 'ok', latency_ms: Date.now() - start };
  } catch (err: any) {
    return { status: 'error', error: err.message };
  }
}

export async function getReadinessStatus() {
  const postgres = await checkPostgres();

  return {
    status: postgres.status === 'ok' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    dependencies: { postgres },
  };
}
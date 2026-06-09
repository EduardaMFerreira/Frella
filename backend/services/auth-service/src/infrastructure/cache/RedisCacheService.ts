import Redis from 'ioredis';
import { logger } from '../logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 200, 5000),
});

redis.on('connect', () => logger.info('[Redis] Conectado com sucesso'));
redis.on('error', (err) => logger.error('[Redis] Erro de conexão', { error: err.message }));

export class RedisCacheService {
  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key);
    } catch (err: any) {
      logger.error('[Redis] Erro ao buscar chave', { key, error: err.message });
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds = 300): Promise<void> {
    try {
      await redis.set(key, value, 'EX', ttlSeconds);
    } catch (err: any) {
      logger.error('[Redis] Erro ao salvar chave', { key, error: err.message });
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (err: any) {
      logger.error('[Redis] Erro ao invalidar chave', { key, error: err.message });
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await redis.exists(key)) === 1;
    } catch (err: any) {
      logger.error('[Redis] Erro ao verificar chave', { key, error: err.message });
      return false;
    }
  }
}

export const redisCacheService = new RedisCacheService();
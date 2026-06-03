import Redis from 'ioredis';
import { ICacheService } from '../../application/interfaces/ICacheService';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const DEFAULT_TTL = 300; // 5 minutos

export class RedisCacheService implements ICacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis(REDIS_URL);

    this.client.on('connect', () =>
      console.log('[Redis] Conectado com sucesso!'));

    this.client.on('error', (err) =>
      console.error('[Redis] Erro:', err.message));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      console.log('[Cache] MISS:', key);
      return null;
    }
    console.log('[Cache] HIT:', key);
    return JSON.parse(data) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = DEFAULT_TTL): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    console.log('[Cache] SET:', key, '| TTL:', ttlSeconds, 's');
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
    console.log('[Cache] INVALIDADO:', key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
      console.log('[Cache] INVALIDADO por padrão:', pattern, '|', keys.length, 'chaves');
    }
  }
}
import jwt from 'jsonwebtoken';
import { redisCacheService } from './RedisCacheService';
import { logger } from '../logger';

export class TokenBlacklistService {
  private prefix = 'blacklist:token:';

  async adicionar(token: string): Promise<void> {
    const ttl = this.calcularTTL(token);
    if (ttl <= 0) return; // token já expirado, não precisa guardar

    const key = this.prefix + token;
    await redisCacheService.set(key, '1', ttl);
    logger.info('[Blacklist] Token adicionado', { ttlSegundos: ttl });
  }

  async estaInvalido(token: string): Promise<boolean> {
    return redisCacheService.exists(this.prefix + token);
  }

  private calcularTTL(token: string): number {
    try {
      const decoded = jwt.decode(token) as { exp?: number } | null;
      if (!decoded?.exp) return 3600; // fallback: 1h
      return decoded.exp - Math.floor(Date.now() / 1000);
    } catch {
      return 3600;
    }
  }
}

export const tokenBlacklistService = new TokenBlacklistService();
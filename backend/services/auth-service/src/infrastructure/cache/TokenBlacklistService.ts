import { redisCacheService } from './RedisCacheService';
import { logger } from '../logger';

// TTL de 7 dias em segundos — igual ao expiresIn do JWT
const TOKEN_TTL = 60 * 60 * 24 * 7;

export class TokenBlacklistService {
  private prefix = 'blacklist:token:';

  async adicionar(token: string): Promise<void> {
    const key = this.prefix + token;
    await redisCacheService.set(key, '1', TOKEN_TTL);
    logger.info('[Blacklist] Token adicionado à blacklist');
  }

  async estaInvalido(token: string): Promise<boolean> {
    const key = this.prefix + token;
    return redisCacheService.exists(key);
  }
}

export const tokenBlacklistService = new TokenBlacklistService();
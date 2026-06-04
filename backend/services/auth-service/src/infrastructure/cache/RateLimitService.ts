import { redisCacheService } from './RedisCacheService';
import { logger } from '../logger';

const MAX_TENTATIVAS = 5;
const JANELA_SEGUNDOS = 60 * 15; // 15 minutos

export class RateLimitService {
  private prefix = 'ratelimit:login:';

  async registrarTentativaFalhada(ip: string): Promise<void> {
    const key = this.prefix + ip;
    const atual = await redisCacheService.get(key);

    if (!atual) {
      await redisCacheService.set(key, '1', JANELA_SEGUNDOS);
    } else {
      const novoValor = String(parseInt(atual) + 1);
      await redisCacheService.set(key, novoValor, JANELA_SEGUNDOS);
    }

    logger.warn('[RateLimit] Tentativa falhada registrada', {
      ip,
      tentativas: parseInt(atual || '0') + 1,
    });
  }

  async estaBloqueado(ip: string): Promise<boolean> {
    const key = this.prefix + ip;
    const atual = await redisCacheService.get(key);
    return parseInt(atual || '0') >= MAX_TENTATIVAS;
  }

  async resetar(ip: string): Promise<void> {
    await redisCacheService.invalidate(this.prefix + ip);
  }
}

export const rateLimitService = new RateLimitService();
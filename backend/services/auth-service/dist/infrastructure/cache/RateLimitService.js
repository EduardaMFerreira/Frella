"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitService = exports.RateLimitService = void 0;
const RedisCacheService_1 = require("./RedisCacheService");
const logger_1 = require("../logger");
const MAX_TENTATIVAS = 5;
const JANELA_SEGUNDOS = 60 * 15; // 15 minutos
class RateLimitService {
    constructor() {
        this.prefix = 'ratelimit:login:';
    }
    async registrarTentativaFalhada(ip) {
        const key = this.prefix + ip;
        const atual = await RedisCacheService_1.redisCacheService.get(key);
        if (!atual) {
            await RedisCacheService_1.redisCacheService.set(key, '1', JANELA_SEGUNDOS);
        }
        else {
            const novoValor = String(parseInt(atual) + 1);
            await RedisCacheService_1.redisCacheService.set(key, novoValor, JANELA_SEGUNDOS);
        }
        logger_1.logger.warn('[RateLimit] Tentativa falhada registrada', {
            ip,
            tentativas: parseInt(atual || '0') + 1,
        });
    }
    async estaBloqueado(ip) {
        const key = this.prefix + ip;
        const atual = await RedisCacheService_1.redisCacheService.get(key);
        return parseInt(atual || '0') >= MAX_TENTATIVAS;
    }
    async resetar(ip) {
        await RedisCacheService_1.redisCacheService.invalidate(this.prefix + ip);
    }
}
exports.RateLimitService = RateLimitService;
exports.rateLimitService = new RateLimitService();

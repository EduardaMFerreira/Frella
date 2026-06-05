"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisCacheService = exports.RedisCacheService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../logger");
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new ioredis_1.default(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 200, 5000),
});
redis.on('connect', () => logger_1.logger.info('[Redis] Conectado com sucesso'));
redis.on('error', (err) => logger_1.logger.error('[Redis] Erro de conexão', { error: err.message }));
class RedisCacheService {
    async get(key) {
        try {
            return await redis.get(key);
        }
        catch (err) {
            logger_1.logger.error('[Redis] Erro ao buscar chave', { key, error: err.message });
            return null;
        }
    }
    async set(key, value, ttlSeconds = 300) {
        try {
            await redis.set(key, value, 'EX', ttlSeconds);
        }
        catch (err) {
            logger_1.logger.error('[Redis] Erro ao salvar chave', { key, error: err.message });
        }
    }
    async invalidate(key) {
        try {
            await redis.del(key);
        }
        catch (err) {
            logger_1.logger.error('[Redis] Erro ao invalidar chave', { key, error: err.message });
        }
    }
    async exists(key) {
        try {
            return (await redis.exists(key)) === 1;
        }
        catch (err) {
            logger_1.logger.error('[Redis] Erro ao verificar chave', { key, error: err.message });
            return false;
        }
    }
}
exports.RedisCacheService = RedisCacheService;
exports.redisCacheService = new RedisCacheService();

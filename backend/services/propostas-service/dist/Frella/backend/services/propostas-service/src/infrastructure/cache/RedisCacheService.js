"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const DEFAULT_TTL = 300; // 5 minutos
class RedisCacheService {
    constructor() {
        this.client = new ioredis_1.default(REDIS_URL);
        this.client.on('connect', () => console.log('[Redis] Conectado com sucesso!'));
        this.client.on('error', (err) => console.error('[Redis] Erro:', err.message));
    }
    async get(key) {
        const data = await this.client.get(key);
        if (!data) {
            console.log('[Cache] MISS:', key);
            return null;
        }
        console.log('[Cache] HIT:', key);
        return JSON.parse(data);
    }
    async set(key, value, ttlSeconds = DEFAULT_TTL) {
        await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        console.log('[Cache] SET:', key, '| TTL:', ttlSeconds, 's');
    }
    async invalidate(key) {
        await this.client.del(key);
        console.log('[Cache] INVALIDADO:', key);
    }
    async invalidatePattern(pattern) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            await this.client.del(...keys);
            console.log('[Cache] INVALIDADO por padrão:', pattern, '|', keys.length, 'chaves');
        }
    }
}
exports.RedisCacheService = RedisCacheService;

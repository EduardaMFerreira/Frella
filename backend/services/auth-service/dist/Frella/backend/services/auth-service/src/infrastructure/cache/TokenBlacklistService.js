"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenBlacklistService = exports.TokenBlacklistService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RedisCacheService_1 = require("./RedisCacheService");
const logger_1 = require("../logger");
class TokenBlacklistService {
    constructor() {
        this.prefix = 'blacklist:token:';
    }
    async adicionar(token) {
        const ttl = this.calcularTTL(token);
        if (ttl <= 0)
            return; // token já expirado, não precisa guardar
        const key = this.prefix + token;
        await RedisCacheService_1.redisCacheService.set(key, '1', ttl);
        logger_1.logger.info('[Blacklist] Token adicionado', { ttlSegundos: ttl });
    }
    async estaInvalido(token) {
        return RedisCacheService_1.redisCacheService.exists(this.prefix + token);
    }
    calcularTTL(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded?.exp)
                return 3600; // fallback: 1h
            return decoded.exp - Math.floor(Date.now() / 1000);
        }
        catch {
            return 3600;
        }
    }
}
exports.TokenBlacklistService = TokenBlacklistService;
exports.tokenBlacklistService = new TokenBlacklistService();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = LoginUseCase;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../../../infrastructure/database/UserRepository");
const RateLimitService_1 = require("../../../infrastructure/cache/RateLimitService");
const logger_1 = require("../../../infrastructure/logger");
async function LoginUseCase(data, ip) {
    // 1. verifica bloqueio por IP antes de qualquer coisa
    const bloqueado = await RateLimitService_1.rateLimitService.estaBloqueado(ip);
    if (bloqueado) {
        logger_1.logger.warn('[Login] IP bloqueado por excesso de tentativas', { ip });
        throw new Error('Muitas tentativas. Tente novamente em 15 minutos');
    }
    logger_1.logger.info('Tentativa de login', { email: data.email, ip });
    const user = await UserRepository_1.UserRepository.findByEmail(data.email);
    if (!user) {
        await RateLimitService_1.rateLimitService.registrarTentativaFalhada(ip);
        logger_1.logger.warn('Login falhou — usuário não encontrado', { email: data.email });
        throw new Error('Credenciais inválidas');
    }
    const valid = await bcryptjs_1.default.compare(data.password, user.password);
    if (!valid) {
        await RateLimitService_1.rateLimitService.registrarTentativaFalhada(ip);
        logger_1.logger.warn('Login falhou — senha incorreta', { email: data.email });
        throw new Error('Credenciais inválidas');
    }
    // login bem-sucedido — limpa o contador
    await RateLimitService_1.rateLimitService.resetar(ip);
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'frella_secret_key', { expiresIn: '7d' });
    logger_1.logger.info('Login realizado com sucesso', { userId: user.id, role: user.role });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
}

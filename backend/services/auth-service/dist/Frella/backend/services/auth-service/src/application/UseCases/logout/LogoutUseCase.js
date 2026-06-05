"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUseCase = LogoutUseCase;
const TokenBlacklistService_1 = require("../../../infrastructure/cache/TokenBlacklistService");
const logger_1 = require("../../../infrastructure/logger");
async function LogoutUseCase(token) {
    logger_1.logger.info('[Logout] Invalidando token');
    const jaInvalido = await TokenBlacklistService_1.tokenBlacklistService.estaInvalido(token);
    if (jaInvalido) {
        throw new Error('Sessão já encerrada');
    }
    await TokenBlacklistService_1.tokenBlacklistService.adicionar(token);
    logger_1.logger.info('[Logout] Token invalidado com sucesso');
}

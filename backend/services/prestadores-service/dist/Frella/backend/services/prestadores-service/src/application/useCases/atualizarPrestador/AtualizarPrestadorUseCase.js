"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarPrestadorUseCase = AtualizarPrestadorUseCase;
exports.RemoverPrestadorUseCase = RemoverPrestadorUseCase;
const PrestadorRepository_1 = require("../../../infrastructure/database/PrestadorRepository");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
async function AtualizarPrestadorUseCase(id, data) {
    logger_1.logger.info('Iniciando atualização de prestador', { prestadorId: id });
    const existente = await PrestadorRepository_1.PrestadorRepository.findById(id);
    if (!existente) {
        logger_1.logger.warn('Prestador não encontrado para atualização', { prestadorId: id });
        throw new Error("Prestador não encontrado");
    }
    if (data.email && data.email !== existente.email) {
        const comMesmoEmail = await PrestadorRepository_1.PrestadorRepository.findByEmail(data.email);
        if (comMesmoEmail) {
            logger_1.logger.warn('Tentativa de atualização com e-mail já cadastrado', { email: data.email });
            throw new Error("E-mail já cadastrado");
        }
    }
    const atualizado = await PrestadorRepository_1.PrestadorRepository.update(id, data);
    await cache.invalidate(`prestador:item:${id}`);
    await cache.invalidatePattern('prestador:lista:*');
    logger_1.logger.info('Prestador atualizado com sucesso', { prestadorId: id });
    return atualizado;
}
async function RemoverPrestadorUseCase(id) {
    logger_1.logger.info('Iniciando remoção de prestador', { prestadorId: id });
    const existente = await PrestadorRepository_1.PrestadorRepository.findById(id);
    if (!existente) {
        logger_1.logger.warn('Prestador não encontrado para remoção', { prestadorId: id });
        throw new Error("Prestador não encontrado");
    }
    await PrestadorRepository_1.PrestadorRepository.remove(id);
    await cache.invalidate(`prestador:item:${id}`);
    await cache.invalidatePattern('prestador:lista:*');
    logger_1.logger.info('Prestador removido com sucesso', { prestadorId: id });
}

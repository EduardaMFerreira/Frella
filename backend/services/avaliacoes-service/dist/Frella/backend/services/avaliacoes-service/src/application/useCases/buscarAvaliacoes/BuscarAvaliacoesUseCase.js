"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarAvaliacaoUseCase = BuscarAvaliacaoUseCase;
exports.ListarAvaliacoesUseCase = ListarAvaliacoesUseCase;
exports.RemoverAvaliacaoUseCase = RemoverAvaliacaoUseCase;
const AvaliacaoRepository_1 = require("../../../infrastructure/database/AvaliacaoRepository");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
const TTL_ITEM = 300; // 5 minutos
const TTL_LISTA = 120; // 2 minutos
async function BuscarAvaliacaoUseCase(id) {
    if (!id?.trim()) {
        logger_1.logger.warn('Tentativa de busca sem ID');
        throw new Error("ID é obrigatório");
    }
    const chave = `avaliacao:item:${id}`;
    const cached = await cache.get(chave);
    if (cached) {
        logger_1.logger.info('Avaliação retornada do cache', { avaliacaoId: id });
        return cached;
    }
    logger_1.logger.info('Cache miss — buscando no banco', { avaliacaoId: id });
    const avaliacao = await AvaliacaoRepository_1.AvaliacaoRepository.findById(id);
    if (!avaliacao) {
        logger_1.logger.warn('Avaliação não encontrada', { avaliacaoId: id });
        throw new Error("Avaliação não encontrada");
    }
    await cache.set(chave, avaliacao, TTL_ITEM);
    return avaliacao;
}
async function ListarAvaliacoesUseCase() {
    const chave = `avaliacao:lista:all`;
    const cached = await cache.get(chave);
    if (cached) {
        logger_1.logger.info('Lista de avaliações retornada do cache');
        return cached;
    }
    logger_1.logger.info('Cache miss — buscando lista no banco');
    const avaliacoes = await AvaliacaoRepository_1.AvaliacaoRepository.findAll();
    logger_1.logger.info('Avaliações encontradas', { total: avaliacoes.length });
    await cache.set(chave, avaliacoes, TTL_LISTA);
    return avaliacoes;
}
async function RemoverAvaliacaoUseCase(id) {
    logger_1.logger.info('Iniciando remoção de avaliação', { avaliacaoId: id });
    const avaliacao = await AvaliacaoRepository_1.AvaliacaoRepository.findById(id);
    if (!avaliacao) {
        logger_1.logger.warn('Avaliação não encontrada para remoção', { avaliacaoId: id });
        throw new Error("Avaliação não encontrada");
    }
    await AvaliacaoRepository_1.AvaliacaoRepository.remove(id);
    await cache.invalidate(`avaliacao:item:${id}`);
    await cache.invalidatePattern('avaliacao:lista:*');
    logger_1.logger.info('Avaliação removida com sucesso', { avaliacaoId: id });
}

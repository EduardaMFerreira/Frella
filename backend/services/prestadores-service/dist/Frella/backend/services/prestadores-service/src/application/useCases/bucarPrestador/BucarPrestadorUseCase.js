"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarPrestadorUseCase = BuscarPrestadorUseCase;
exports.ListarPrestadoresUseCase = ListarPrestadoresUseCase;
exports.ListarPorEspecialidadeUseCase = ListarPorEspecialidadeUseCase;
const PrestadorRepository_1 = require("../../../infrastructure/database/PrestadorRepository");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
const TTL_ITEM = 300; // 5 minutos
const TTL_LISTA = 120; // 2 minutos
async function BuscarPrestadorUseCase(id) {
    if (!id?.trim()) {
        logger_1.logger.warn('Tentativa de busca sem ID');
        throw new Error("ID é obrigatório");
    }
    const chave = `prestador:item:${id}`;
    const cached = await cache.get(chave);
    if (cached) {
        logger_1.logger.info('Prestador retornado do cache', { prestadorId: id });
        return cached;
    }
    logger_1.logger.info('Cache miss — buscando no banco', { prestadorId: id });
    const prestador = await PrestadorRepository_1.PrestadorRepository.findById(id);
    if (!prestador) {
        logger_1.logger.warn('Prestador não encontrado', { prestadorId: id });
        throw new Error("Prestador não encontrado");
    }
    await cache.set(chave, prestador, TTL_ITEM);
    return prestador;
}
async function ListarPrestadoresUseCase() {
    const chave = `prestador:lista:all`;
    const cached = await cache.get(chave);
    if (cached) {
        logger_1.logger.info('Lista de prestadores retornada do cache');
        return cached;
    }
    logger_1.logger.info('Cache miss — buscando lista no banco');
    const prestadores = await PrestadorRepository_1.PrestadorRepository.findAll();
    logger_1.logger.info('Prestadores encontrados', { total: prestadores.length });
    await cache.set(chave, prestadores, TTL_LISTA);
    return prestadores;
}
async function ListarPorEspecialidadeUseCase(especialidade) {
    if (!especialidade?.trim()) {
        logger_1.logger.warn('Busca por especialidade sem informar especialidade');
        throw new Error("Especialidade é obrigatória");
    }
    const chave = `prestador:lista:esp=${especialidade}`;
    const cached = await cache.get(chave);
    if (cached) {
        logger_1.logger.info('Lista por especialidade retornada do cache', { especialidade });
        return cached;
    }
    logger_1.logger.info('Cache miss — buscando por especialidade no banco', { especialidade });
    const prestadores = await PrestadorRepository_1.PrestadorRepository.findByEspecialidade(especialidade);
    logger_1.logger.info('Prestadores encontrados por especialidade', {
        especialidade,
        total: prestadores.length,
    });
    await cache.set(chave, prestadores, TTL_LISTA);
    return prestadores;
}

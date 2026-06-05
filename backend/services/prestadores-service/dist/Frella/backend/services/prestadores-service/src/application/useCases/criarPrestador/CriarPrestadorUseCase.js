"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarPrestadorUseCase = CriarPrestadorUseCase;
const PrestadorRepository_1 = require("../../../infrastructure/database/PrestadorRepository");
const Especialidade_1 = require("../../../domain/valueObjects/Especialidade");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
async function CriarPrestadorUseCase(data) {
    logger_1.logger.info('Iniciando criação de prestador', { email: data.email });
    if (!data.nome?.trim()) {
        logger_1.logger.warn('Criação de prestador sem nome');
        throw new Error("Nome é obrigatório");
    }
    if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        logger_1.logger.warn('Criação de prestador com e-mail inválido', { email: data.email });
        throw new Error("E-mail inválido");
    }
    if (!data.especialidades?.length) {
        logger_1.logger.warn('Criação de prestador sem especialidades');
        throw new Error("Informe pelo menos uma especialidade");
    }
    const existente = await PrestadorRepository_1.PrestadorRepository.findByEmail(data.email);
    if (existente) {
        logger_1.logger.warn('Tentativa de cadastro com e-mail já existente', { email: data.email });
        throw new Error("E-mail já cadastrado");
    }
    data.especialidades.map((e) => Especialidade_1.Especialidade.create(e).toString());
    const prestador = await PrestadorRepository_1.PrestadorRepository.create({
        nome: data.nome.trim(),
        email: data.email.trim().toLowerCase(),
        telefone: data.telefone?.trim(),
        especialidades: data.especialidades,
        descricao: data.descricao?.trim(),
        valor_hora: data.valor_hora,
        endereco: data.endereco,
    });
    await cache.invalidatePattern('prestador:lista:*');
    logger_1.logger.info('Prestador criado com sucesso', {
        prestadorId: prestador.id,
        especialidades: data.especialidades,
    });
    return prestador;
}

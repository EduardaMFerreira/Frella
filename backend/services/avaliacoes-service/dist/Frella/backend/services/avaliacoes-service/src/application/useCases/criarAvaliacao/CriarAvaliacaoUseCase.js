"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarAvaliacaoUseCase = CriarAvaliacaoUseCase;
const AvaliacaoRepository_1 = require("../../../infrastructure/database/AvaliacaoRepository");
const RabbitMQConnection_1 = require("../../../infrastructure/messaging/rabbitmq/RabbitMQConnection");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
async function CriarAvaliacaoUseCase(data) {
    logger_1.logger.info('Iniciando criação de avaliação', {
        clienteId: data.cliente_id,
        prestadorId: data.prestador_id,
        nota: data.nota,
    });
    if (!data.nota) {
        logger_1.logger.warn('Criação de avaliação sem nota');
        throw new Error("Nota é obrigatória");
    }
    if (!data.cliente_id) {
        logger_1.logger.warn('Criação de avaliação sem cliente');
        throw new Error("Cliente é obrigatório");
    }
    if (!data.prestador_id) {
        logger_1.logger.warn('Criação de avaliação sem prestador');
        throw new Error("Prestador é obrigatório");
    }
    if (data.nota < 1 || data.nota > 5) {
        logger_1.logger.warn('Nota fora do intervalo permitido', { nota: data.nota });
        throw new Error("Nota deve ser entre 1 e 5");
    }
    const avaliacao = await AvaliacaoRepository_1.AvaliacaoRepository.create({
        nota: data.nota,
        comentario: data.comentario,
        cliente_id: data.cliente_id,
        prestador_id: data.prestador_id,
    });
    const evento = {
        tipo: 'avaliacao.criada',
        avaliacao_id: avaliacao.id,
        cliente_id: avaliacao.cliente_id,
        prestador_id: avaliacao.prestador_id,
        nota: avaliacao.nota,
        comentario: avaliacao.comentario,
        created_at: avaliacao.created_at,
    };
    await (0, RabbitMQConnection_1.publishEvent)(evento);
    logger_1.logger.info('Evento avaliacao.criada publicado', { avaliacaoId: avaliacao.id });
    await cache.invalidatePattern('avaliacao:lista:*');
    logger_1.logger.info('Avaliação criada com sucesso', { avaliacaoId: avaliacao.id });
    return avaliacao;
}

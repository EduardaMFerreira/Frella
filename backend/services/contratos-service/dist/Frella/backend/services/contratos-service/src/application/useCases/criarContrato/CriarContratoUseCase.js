"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarContratoUseCase = CriarContratoUseCase;
const ContratoRepository_1 = require("../../../infrastructure/database/ContratoRepository");
const PeriodoServico_1 = require("../../../domain/valueObjects/PeriodoServico");
const StatusContrato_1 = require("../../../domain/enums/StatusContrato");
const RabbitMQConnection_1 = require("../../../infrastructure/messaging/rabbitmq/RabbitMQConnection");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
async function CriarContratoUseCase(data) {
    logger_1.logger.info('Iniciando criação de contrato', {
        clienteId: data.cliente_id,
        prestadorId: data.prestador_id,
        valor: data.valor,
    });
    if (!data.cliente_id?.trim()) {
        logger_1.logger.warn('Criação de contrato sem cliente_id');
        throw new Error("cliente_id é obrigatório");
    }
    if (!data.prestador_id?.trim()) {
        logger_1.logger.warn('Criação de contrato sem prestador_id');
        throw new Error("prestador_id é obrigatório");
    }
    if (!data.descricao?.trim()) {
        logger_1.logger.warn('Criação de contrato sem descrição');
        throw new Error("Descrição é obrigatória");
    }
    if (!data.valor || data.valor <= 0) {
        logger_1.logger.warn('Criação de contrato com valor inválido', { valor: data.valor });
        throw new Error("Valor deve ser maior que zero");
    }
    const periodo = PeriodoServico_1.PeriodoServico.create(data.data_inicio, data.data_fim);
    const contrato = await ContratoRepository_1.ContratoRepository.create({
        cliente_id: data.cliente_id,
        prestador_id: data.prestador_id,
        descricao: data.descricao.trim(),
        valor: data.valor,
        data_inicio: periodo.getDataInicio(),
        data_fim: periodo.getDataFim(),
        status: StatusContrato_1.StatusContrato.PENDENTE,
    });
    const evento = {
        tipo: 'contrato.criado',
        contrato_id: contrato.id,
        cliente_id: contrato.cliente_id,
        prestador_id: contrato.prestador_id,
        descricao: contrato.descricao,
        valor: contrato.valor,
        data_inicio: contrato.data_inicio,
        data_fim: contrato.data_fim,
        status: contrato.status,
        created_at: contrato.created_at,
    };
    await (0, RabbitMQConnection_1.publishEvent)(evento);
    logger_1.logger.info('Evento contrato.criado publicado', { contratoId: contrato.id });
    await cache.invalidatePattern('contrato:lista:*');
    logger_1.logger.info('Contrato criado com sucesso', { contratoId: contrato.id });
    return contrato;
}

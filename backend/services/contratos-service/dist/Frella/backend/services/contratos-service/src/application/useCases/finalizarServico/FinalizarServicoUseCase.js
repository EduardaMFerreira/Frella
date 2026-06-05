"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalizarServicoUseCase = FinalizarServicoUseCase;
exports.CancelarContratoUseCase = CancelarContratoUseCase;
const ContratoRepository_1 = require("../../../infrastructure/database/ContratoRepository");
const StatusContrato_1 = require("../../../domain/enums/StatusContrato");
const RabbitMQConnection_1 = require("../../../infrastructure/messaging/rabbitmq/RabbitMQConnection");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
async function FinalizarServicoUseCase(id) {
    logger_1.logger.info('Iniciando finalização de serviço', { contratoId: id });
    if (!id?.trim()) {
        logger_1.logger.warn('Finalização sem ID');
        throw new Error("ID é obrigatório");
    }
    const contrato = await ContratoRepository_1.ContratoRepository.findById(id);
    if (!contrato) {
        logger_1.logger.warn('Contrato não encontrado para finalização', { contratoId: id });
        throw new Error("Contrato não encontrado");
    }
    if (contrato.status !== StatusContrato_1.StatusContrato.EM_ANDAMENTO) {
        logger_1.logger.warn('Tentativa de finalizar contrato fora do status permitido', {
            contratoId: id,
            statusAtual: contrato.status,
        });
        throw new Error("Apenas contratos em andamento podem ser finalizados");
    }
    const atualizado = await ContratoRepository_1.ContratoRepository.updateStatus(id, StatusContrato_1.StatusContrato.FINALIZADO);
    const evento = {
        tipo: 'servico.finalizado',
        contrato_id: atualizado.id,
        cliente_id: atualizado.cliente_id,
        prestador_id: atualizado.prestador_id,
        status: atualizado.status,
        updated_at: atualizado.updated_at,
    };
    await (0, RabbitMQConnection_1.publishEvent)(evento);
    logger_1.logger.info('Evento servico.finalizado publicado', { contratoId: id });
    await cache.invalidate(`contrato:item:${id}`);
    await cache.invalidatePattern('contrato:lista:*');
    logger_1.logger.info('Serviço finalizado com sucesso', { contratoId: id });
    return atualizado;
}
async function CancelarContratoUseCase(id) {
    logger_1.logger.info('Iniciando cancelamento de contrato', { contratoId: id });
    if (!id?.trim()) {
        logger_1.logger.warn('Cancelamento sem ID');
        throw new Error("ID é obrigatório");
    }
    const contrato = await ContratoRepository_1.ContratoRepository.findById(id);
    if (!contrato) {
        logger_1.logger.warn('Contrato não encontrado para cancelamento', { contratoId: id });
        throw new Error("Contrato não encontrado");
    }
    if (contrato.status === StatusContrato_1.StatusContrato.FINALIZADO) {
        logger_1.logger.warn('Tentativa de cancelar contrato já finalizado', {
            contratoId: id,
            statusAtual: contrato.status,
        });
        throw new Error("Contratos finalizados não podem ser cancelados");
    }
    const atualizado = await ContratoRepository_1.ContratoRepository.updateStatus(id, StatusContrato_1.StatusContrato.CANCELADO);
    await cache.invalidate(`contrato:item:${id}`);
    await cache.invalidatePattern('contrato:lista:*');
    logger_1.logger.info('Contrato cancelado com sucesso', { contratoId: id });
    return atualizado;
}

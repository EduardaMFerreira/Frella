"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IniciarServicoUseCase = IniciarServicoUseCase;
const ContratoRepository_1 = require("../../../infrastructure/database/ContratoRepository");
const StatusContrato_1 = require("../../../domain/enums/StatusContrato");
const RabbitMQConnection_1 = require("../../../infrastructure/messaging/rabbitmq/RabbitMQConnection");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
async function IniciarServicoUseCase(id) {
    logger_1.logger.info('Iniciando serviço', { contratoId: id });
    if (!id?.trim()) {
        logger_1.logger.warn('Início de serviço sem ID');
        throw new Error("ID é obrigatório");
    }
    const contrato = await ContratoRepository_1.ContratoRepository.findById(id);
    if (!contrato) {
        logger_1.logger.warn('Contrato não encontrado para início', { contratoId: id });
        throw new Error("Contrato não encontrado");
    }
    if (contrato.status !== StatusContrato_1.StatusContrato.PENDENTE) {
        logger_1.logger.warn('Tentativa de iniciar contrato fora do status permitido', {
            contratoId: id,
            statusAtual: contrato.status,
        });
        throw new Error("Apenas contratos pendentes podem ser iniciados");
    }
    const atualizado = await ContratoRepository_1.ContratoRepository.updateStatus(id, StatusContrato_1.StatusContrato.EM_ANDAMENTO);
    const evento = {
        tipo: 'servico.iniciado',
        contrato_id: atualizado.id,
        cliente_id: atualizado.cliente_id,
        prestador_id: atualizado.prestador_id,
        status: atualizado.status,
        updated_at: atualizado.updated_at,
    };
    await (0, RabbitMQConnection_1.publishEvent)(evento);
    logger_1.logger.info('Evento servico.iniciado publicado', { contratoId: id });
    await cache.invalidate(`contrato:item:${id}`);
    await cache.invalidatePattern('contrato:lista:*');
    logger_1.logger.info('Serviço iniciado com sucesso', { contratoId: id });
    return atualizado;
}

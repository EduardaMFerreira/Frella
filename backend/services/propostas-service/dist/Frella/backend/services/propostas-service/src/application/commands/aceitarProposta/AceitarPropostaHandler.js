"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AceitarPropostaHandler = AceitarPropostaHandler;
const PropostaRepositoryResilient_1 = require("../../../infrastructure/database/PropostaRepositoryResilient");
const RabbitMQConnection_1 = require("../../../infrastructure/messaging/rabbitmq/RabbitMQConnection");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const logger_1 = require("../../../infrastructure/logger");
const cache = new RedisCacheService_1.RedisCacheService();
async function AceitarPropostaHandler(command) {
    logger_1.logger.info('Iniciando aceitação de proposta', { propostaId: command.proposta_id });
    if (!command.proposta_id) {
        logger_1.logger.warn('Aceitação sem ID da proposta');
        throw new Error("ID da proposta é obrigatório");
    }
    const proposta = await PropostaRepositoryResilient_1.PropostaRepositoryResilient.findById(command.proposta_id);
    if (!proposta) {
        logger_1.logger.warn('Proposta não encontrada para aceitação', { propostaId: command.proposta_id });
        throw new Error("Proposta não encontrada");
    }
    if (proposta.status === "ACEITA") {
        logger_1.logger.warn('Tentativa de aceitar proposta já aceita', { propostaId: command.proposta_id });
        throw new Error("Proposta já foi aceita");
    }
    const propostaAtualizada = await PropostaRepositoryResilient_1.PropostaRepositoryResilient.updateStatus(command.proposta_id, "ACEITA");
    const evento = {
        tipo: "proposta.aceita",
        proposta_id: propostaAtualizada.id,
        status: propostaAtualizada.status,
        updated_at: propostaAtualizada.updated_at,
    };
    await (0, RabbitMQConnection_1.publishEvent)(evento);
    logger_1.logger.info('Evento proposta.aceita publicado', { propostaId: command.proposta_id });
    await cache.invalidate(`proposta:item:${command.proposta_id}`);
    await cache.invalidatePattern('proposta:lista:*');
    logger_1.logger.info('Proposta aceita com sucesso', { propostaId: command.proposta_id });
    return propostaAtualizada;
}

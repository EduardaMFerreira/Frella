"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoverPropostaHandler = RemoverPropostaHandler;
const PropostaRepositoryResilient_1 = require("../../../infrastructure/database/PropostaRepositoryResilient");
const RabbitMQConnection_1 = require("../../../infrastructure/messaging/rabbitmq/RabbitMQConnection");
const logger_1 = require("../../../infrastructure/logger");
async function RemoverPropostaHandler(command) {
    logger_1.logger.info('Iniciando remoção de proposta', { propostaId: command.id });
    const proposta = await PropostaRepositoryResilient_1.PropostaRepositoryResilient.findById(command.id);
    if (!proposta) {
        logger_1.logger.warn('Proposta não encontrada para remoção', { propostaId: command.id });
        throw new Error("Proposta não encontrada");
    }
    await PropostaRepositoryResilient_1.PropostaRepositoryResilient.remove(command.id);
    const evento = {
        tipo: 'proposta.removida',
        proposta_id: command.id,
    };
    await (0, RabbitMQConnection_1.publishEvent)(evento);
    logger_1.logger.info('Evento proposta.removida publicado', { propostaId: command.id });
    logger_1.logger.info('Proposta removida com sucesso', { propostaId: command.id });
}

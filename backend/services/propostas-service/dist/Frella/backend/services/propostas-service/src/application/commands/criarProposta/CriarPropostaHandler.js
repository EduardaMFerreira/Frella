"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarPropostaHandler = void 0;
const PropostaRepositoryResilient_1 = require("../../../infrastructure/database/PropostaRepositoryResilient");
const CriarPropostaValidator_1 = require("../../validators/CriarPropostaValidator");
const RabbitMQConnection_1 = require("../../../infrastructure/messaging/rabbitmq/RabbitMQConnection");
const logger_1 = require("../../../infrastructure/logger");
class CriarPropostaHandler {
    async execute(cmd) {
        logger_1.logger.info('Iniciando criação de proposta', {
            clienteId: cmd.cliente_id,
            prestadorId: cmd.prestador_id,
            valor: cmd.valor,
        });
        (0, CriarPropostaValidator_1.validarCriarProposta)(cmd);
        const proposta = await PropostaRepositoryResilient_1.PropostaRepositoryResilient.create({
            titulo: cmd.titulo,
            descricao: cmd.descricao,
            valor: cmd.valor,
            status: "Criada",
            cliente_id: cmd.cliente_id,
            prestador_id: cmd.prestador_id,
        });
        const evento = {
            tipo: 'proposta.criada',
            proposta_id: proposta.id,
            titulo: proposta.titulo,
            descricao: proposta.descricao,
            valor: proposta.valor,
            status: proposta.status,
            cliente_id: proposta.cliente_id,
            prestador_id: proposta.prestador_id,
            created_at: proposta.created_at,
        };
        await (0, RabbitMQConnection_1.publishEvent)(evento);
        logger_1.logger.info('Evento proposta.criada publicado', { propostaId: proposta.id });
        logger_1.logger.info('Proposta criada com sucesso', { propostaId: proposta.id });
        return proposta;
    }
}
exports.CriarPropostaHandler = CriarPropostaHandler;

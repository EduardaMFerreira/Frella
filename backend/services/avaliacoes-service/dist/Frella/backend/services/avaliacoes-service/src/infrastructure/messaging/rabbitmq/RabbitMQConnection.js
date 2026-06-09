"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVALIACAO_DLQ = exports.AVALIACAO_QUEUE = exports.AVALIACAO_EXCHANGE = void 0;
exports.getRabbitMQChannel = getRabbitMQChannel;
exports.publishEvent = publishEvent;
const amqplib_1 = __importDefault(require("amqplib"));
const logger_1 = require("../../logger");
const ResiliencePolicy_1 = require("../../resilience/ResiliencePolicy");
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://frella:frella@localhost:5672';
exports.AVALIACAO_EXCHANGE = 'avaliacao.eventos';
exports.AVALIACAO_QUEUE = 'avaliacao.eventos.queue';
exports.AVALIACAO_DLQ = 'avaliacao.eventos.dlq';
let connection;
let channel;
async function conectar(tentativa = 1) {
    const MAX_TENTATIVAS = 10;
    const ESPERA_MS = Math.min(1000 * tentativa, 15000);
    try {
        logger_1.logger.info(`[RabbitMQ-Avaliacoes] Tentativa ${tentativa} de conexão...`);
        connection = await amqplib_1.default.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(exports.AVALIACAO_DLQ, { durable: true });
        await channel.assertQueue(exports.AVALIACAO_QUEUE, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': '',
                'x-dead-letter-routing-key': exports.AVALIACAO_DLQ,
            },
        });
        await channel.assertExchange(exports.AVALIACAO_EXCHANGE, 'fanout', { durable: true });
        await channel.bindQueue(exports.AVALIACAO_QUEUE, exports.AVALIACAO_EXCHANGE, '');
        connection.on('close', () => {
            logger_1.logger.warn('[RabbitMQ-Avaliacoes] Conexão encerrada. Reconectando...');
            channel = null;
            connection = null;
            setTimeout(() => conectar(1), 2000);
        });
        connection.on('error', (err) => {
            logger_1.logger.error('[RabbitMQ-Avaliacoes] Erro na conexão', { error: err.message });
        });
        logger_1.logger.info('[RabbitMQ-Avaliacoes] Conectado com sucesso!');
    }
    catch (err) {
        logger_1.logger.error(`[RabbitMQ-Avaliacoes] Falha na tentativa ${tentativa}`, { error: err.message });
        if (tentativa >= MAX_TENTATIVAS) {
            throw new Error('[RabbitMQ-Avaliacoes] Número máximo de tentativas atingido.');
        }
        logger_1.logger.info(`[RabbitMQ-Avaliacoes] Aguardando ${ESPERA_MS}ms antes de tentar novamente...`);
        await new Promise((resolve) => setTimeout(resolve, ESPERA_MS));
        await conectar(tentativa + 1);
    }
}
async function getRabbitMQChannel() {
    if (channel)
        return channel;
    await conectar();
    return channel;
}
async function publishEvent(event) {
    await ResiliencePolicy_1.resilientPolicy.execute(async () => {
        const ch = await getRabbitMQChannel();
        ch.publish(exports.AVALIACAO_EXCHANGE, '', Buffer.from(JSON.stringify(event)), { persistent: true });
        logger_1.logger.info('[RabbitMQ-Avaliacoes] Evento publicado', { event });
    });
}

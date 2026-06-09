"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROPOSTA_DLQ = exports.PROPOSTA_QUEUE = exports.PROPOSTA_EXCHANGE = void 0;
exports.getRabbitMQChannel = getRabbitMQChannel;
exports.publishEvent = publishEvent;
const amqplib_1 = __importDefault(require("amqplib"));
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://frella:frella@localhost:5672';
exports.PROPOSTA_EXCHANGE = 'proposta.eventos';
exports.PROPOSTA_QUEUE = 'proposta.eventos.queue';
exports.PROPOSTA_DLQ = 'proposta.eventos.dlq';
let connection;
let channel;
async function conectar(tentativa = 1) {
    const MAX_TENTATIVAS = 10;
    const ESPERA_MS = Math.min(1000 * tentativa, 15000); // cresce até 15s
    try {
        console.log(`[RabbitMQ] Tentativa ${tentativa} de conexão...`);
        connection = await amqplib_1.default.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        // ── Dead Letter Queue ──────────────────────────────────────
        // Fila que recebe mensagens que falharam após todas as tentativas
        await channel.assertQueue(exports.PROPOSTA_DLQ, { durable: true });
        // ── Fila principal com Dead Letter configurado ─────────────
        await channel.assertQueue(exports.PROPOSTA_QUEUE, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': '',
                'x-dead-letter-routing-key': exports.PROPOSTA_DLQ,
            },
        });
        // ── Exchange Fanout ────────────────────────────────────────
        // Permite múltiplos consumers receberem o mesmo evento
        await channel.assertExchange(exports.PROPOSTA_EXCHANGE, 'fanout', { durable: true });
        await channel.bindQueue(exports.PROPOSTA_QUEUE, exports.PROPOSTA_EXCHANGE, '');
        // Reconectar automaticamente se a conexão cair
        connection.on('close', () => {
            console.warn('[RabbitMQ] Conexão encerrada. Reconectando...');
            channel = null;
            connection = null;
            setTimeout(() => conectar(1), 2000);
        });
        connection.on('error', (err) => {
            console.error('[RabbitMQ] Erro na conexão:', err.message);
        });
        console.log('[RabbitMQ] Conectado com sucesso!');
    }
    catch (err) {
        console.error(`[RabbitMQ] Falha na tentativa ${tentativa}:`, err.message);
        if (tentativa >= MAX_TENTATIVAS) {
            throw new Error('[RabbitMQ] Número máximo de tentativas atingido. Encerrando.');
        }
        console.log(`[RabbitMQ] Aguardando ${ESPERA_MS}ms antes de tentar novamente...`);
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
const ResiliencePolicy_1 = require("../../resilience/ResiliencePolicy");
async function publishEvent(event) {
    await ResiliencePolicy_1.resilientPolicy.execute(async () => {
        const ch = await getRabbitMQChannel();
        ch.publish(exports.PROPOSTA_EXCHANGE, '', Buffer.from(JSON.stringify(event)), { persistent: true });
        console.log('[RabbitMQ] Evento publicado no Exchange:', JSON.stringify(event));
    });
}

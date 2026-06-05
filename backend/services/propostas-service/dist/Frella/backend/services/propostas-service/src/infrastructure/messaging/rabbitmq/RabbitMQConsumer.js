"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarConsumer = iniciarConsumer;
const RabbitMQConnection_1 = require("./RabbitMQConnection");
const PropostaProjector_1 = require("../../../application/projections/PropostaProjector");
const uuid_1 = require("uuid");
async function iniciarConsumer() {
    const channel = await (0, RabbitMQConnection_1.getRabbitMQChannel)();
    console.log('[Consumer] Aguardando eventos na fila:', RabbitMQConnection_1.PROPOSTA_QUEUE);
    channel.consume(RabbitMQConnection_1.PROPOSTA_QUEUE, async (msg) => {
        if (!msg)
            return;
        // Usa o messageId do RabbitMQ se existir, senão gera um UUID
        const eventoId = msg.properties.messageId || (0, uuid_1.v4)();
        try {
            const evento = JSON.parse(msg.content.toString());
            console.log('[Consumer] Evento recebido:', evento.tipo, '| ID:', eventoId);
            await (0, PropostaProjector_1.PropostaProjector)(evento, eventoId);
            channel.ack(msg);
            console.log('[Consumer] Evento processado com sucesso!');
        }
        catch (err) {
            console.error('[Consumer] Erro ao processar evento:', err);
            // false, false = não reagenda — vai para a Dead Letter Queue
            channel.nack(msg, false, false);
        }
    });
}

import { getRabbitMQChannel, PROPOSTA_QUEUE } from './RabbitMQConnection';
import { PropostaProjector } from '../../../application/projections/PropostaProjector';
import { v4 as uuidv4 } from 'uuid';

export async function iniciarConsumer(): Promise<void> {
  const channel = await getRabbitMQChannel();

  console.log('[Consumer] Aguardando eventos na fila:', PROPOSTA_QUEUE);

  channel.consume(PROPOSTA_QUEUE, async (msg) => {
    if (!msg) return;

    // Usa o messageId do RabbitMQ se existir, senão gera um UUID
    const eventoId = msg.properties.messageId || uuidv4();

    try {
      const evento = JSON.parse(msg.content.toString());
      console.log('[Consumer] Evento recebido:', evento.tipo, '| ID:', eventoId);

      await PropostaProjector(evento, eventoId);

      channel.ack(msg);
      console.log('[Consumer] Evento processado com sucesso!');
    } catch (err) {
      console.error('[Consumer] Erro ao processar evento:', err);
      // false, false = não reagenda — vai para a Dead Letter Queue
      channel.nack(msg, false, false);
    }
  });
}
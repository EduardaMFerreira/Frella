import { getRabbitMQChannel, PROPOSTA_QUEUE } from './RabbitMQConnection';
import { PropostaProjector } from '../../../application/projections/PropostaProjector';

export async function iniciarConsumer(): Promise<void> {
  const channel = await getRabbitMQChannel();

  console.log('[Consumer] Aguardando eventos na fila:', PROPOSTA_QUEUE);

  channel.consume(PROPOSTA_QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const evento = JSON.parse(msg.content.toString());
      console.log('[Consumer] Evento recebido:', evento.tipo);

      await PropostaProjector(evento);

      channel.ack(msg);
      console.log('[Consumer] Evento processado com sucesso!');
    } catch (err) {
      console.error('[Consumer] Erro ao processar evento:', err);
      channel.nack(msg, false, false);
    }
  });
}
import amqp, { Channel, Connection } from 'amqplib';
import { logger } from '../../logger';
import { resilientPolicy } from '../../resilience/ResiliencePolicy'

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://frella:frella@localhost:5672';
export const AVALIACAO_EXCHANGE = 'avaliacao.eventos';
export const AVALIACAO_QUEUE = 'avaliacao.eventos.queue';
export const AVALIACAO_DLQ = 'avaliacao.eventos.dlq';

let connection: Connection;
let channel: Channel;

async function conectar(tentativa = 1): Promise<void> {
  const MAX_TENTATIVAS = 10;
  const ESPERA_MS = Math.min(1000 * tentativa, 15000);

  try {
    logger.info(`[RabbitMQ-Avaliacoes] Tentativa ${tentativa} de conexão...`);
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(AVALIACAO_DLQ, { durable: true });

    await channel.assertQueue(AVALIACAO_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': AVALIACAO_DLQ,
      },
    });

    await channel.assertExchange(AVALIACAO_EXCHANGE, 'fanout', { durable: true });
    await channel.bindQueue(AVALIACAO_QUEUE, AVALIACAO_EXCHANGE, '');

    connection.on('close', () => {
      logger.warn('[RabbitMQ-Avaliacoes] Conexão encerrada. Reconectando...');
      channel = null as any;
      connection = null as any;
      setTimeout(() => conectar(1), 2000);
    });

    connection.on('error', (err) => {
      logger.error('[RabbitMQ-Avaliacoes] Erro na conexão', { error: err.message });
    });

    logger.info('[RabbitMQ-Avaliacoes] Conectado com sucesso!');
  } catch (err: any) {
    logger.error(`[RabbitMQ-Avaliacoes] Falha na tentativa ${tentativa}`, { error: err.message });

    if (tentativa >= MAX_TENTATIVAS) {
      throw new Error('[RabbitMQ-Avaliacoes] Número máximo de tentativas atingido.');
    }

    logger.info(`[RabbitMQ-Avaliacoes] Aguardando ${ESPERA_MS}ms antes de tentar novamente...`);
    await new Promise((resolve) => setTimeout(resolve, ESPERA_MS));
    await conectar(tentativa + 1);
  }
}

export async function getRabbitMQChannel(): Promise<Channel> {
  if (channel) return channel;
  await conectar();
  return channel;
}

export async function publishEvent(event: object): Promise<void> {
  await resilientPolicy.execute(async () => {
    const ch = await getRabbitMQChannel();
    ch.publish(
      AVALIACAO_EXCHANGE,
      '',
      Buffer.from(JSON.stringify(event)),
      { persistent: true }
    );
    logger.info('[RabbitMQ-Avaliacoes] Evento publicado', { event });
  });
}
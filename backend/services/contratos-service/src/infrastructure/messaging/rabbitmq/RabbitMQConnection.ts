import amqp, { Channel, Connection } from 'amqplib';
import { logger } from '../../logger';
import { resilientPolicy } from '../../resilience/ResiliencePolicy';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://frella:frella@localhost:5672';
export const CONTRATO_EXCHANGE = 'contrato.eventos';
export const CONTRATO_QUEUE = 'contrato.eventos.queue';
export const CONTRATO_DLQ = 'contrato.eventos.dlq';

let connection: Connection;
let channel: Channel;

async function conectar(tentativa = 1): Promise<void> {
  const MAX_TENTATIVAS = 10;
  const ESPERA_MS = Math.min(1000 * tentativa, 15000);

  try {
    logger.info(`[RabbitMQ-Contratos] Tentativa ${tentativa} de conexão...`);
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(CONTRATO_DLQ, { durable: true });

    await channel.assertQueue(CONTRATO_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': CONTRATO_DLQ,
      },
    });

    await channel.assertExchange(CONTRATO_EXCHANGE, 'fanout', { durable: true });
    await channel.bindQueue(CONTRATO_QUEUE, CONTRATO_EXCHANGE, '');

    connection.on('close', () => {
      logger.warn('[RabbitMQ-Contratos] Conexão encerrada. Reconectando...');
      channel = null as any;
      connection = null as any;
      setTimeout(() => conectar(1), 2000);
    });

    connection.on('error', (err) => {
      logger.error('[RabbitMQ-Contratos] Erro na conexão', { error: err.message });
    });

    logger.info('[RabbitMQ-Contratos] Conectado com sucesso!');
  } catch (err: any) {
    logger.error(`[RabbitMQ-Contratos] Falha na tentativa ${tentativa}`, { error: err.message });

    if (tentativa >= MAX_TENTATIVAS) {
      throw new Error('[RabbitMQ-Contratos] Número máximo de tentativas atingido.');
    }

    logger.info(`[RabbitMQ-Contratos] Aguardando ${ESPERA_MS}ms antes de tentar novamente...`);
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
      CONTRATO_EXCHANGE,
      '',
      Buffer.from(JSON.stringify(event)),
      { persistent: true }
    );
    logger.info('[RabbitMQ-Contratos] Evento publicado', { event });
  });
}
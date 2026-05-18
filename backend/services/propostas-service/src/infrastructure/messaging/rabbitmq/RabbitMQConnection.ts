import amqp, { Channel, Connection } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://frella:frella@localhost:5672';
export const PROPOSTA_EXCHANGE = 'proposta.eventos';
export const PROPOSTA_QUEUE = 'proposta.eventos.queue';
export const PROPOSTA_DLQ = 'proposta.eventos.dlq';

let connection: Connection;
let channel: Channel;

async function conectar(tentativa = 1): Promise<void> {
  const MAX_TENTATIVAS = 10;
  const ESPERA_MS = Math.min(1000 * tentativa, 15000); // cresce até 15s

  try {
    console.log(`[RabbitMQ] Tentativa ${tentativa} de conexão...`);
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // ── Dead Letter Queue ──────────────────────────────────────
    // Fila que recebe mensagens que falharam após todas as tentativas
    await channel.assertQueue(PROPOSTA_DLQ, { durable: true });

    // ── Fila principal com Dead Letter configurado ─────────────
    await channel.assertQueue(PROPOSTA_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': PROPOSTA_DLQ,
      },
    });

    // ── Exchange Fanout ────────────────────────────────────────
    // Permite múltiplos consumers receberem o mesmo evento
    await channel.assertExchange(PROPOSTA_EXCHANGE, 'fanout', { durable: true });
    await channel.bindQueue(PROPOSTA_QUEUE, PROPOSTA_EXCHANGE, '');

    // Reconectar automaticamente se a conexão cair
    connection.on('close', () => {
      console.warn('[RabbitMQ] Conexão encerrada. Reconectando...');
      channel = null as any;
      connection = null as any;
      setTimeout(() => conectar(1), 2000);
    });

    connection.on('error', (err) => {
      console.error('[RabbitMQ] Erro na conexão:', err.message);
    });

    console.log('[RabbitMQ] Conectado com sucesso!');
  } catch (err: any) {
    console.error(`[RabbitMQ] Falha na tentativa ${tentativa}:`, err.message);

    if (tentativa >= MAX_TENTATIVAS) {
      throw new Error('[RabbitMQ] Número máximo de tentativas atingido. Encerrando.');
    }

    console.log(`[RabbitMQ] Aguardando ${ESPERA_MS}ms antes de tentar novamente...`);
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
  const ch = await getRabbitMQChannel();
  ch.publish(
    PROPOSTA_EXCHANGE,
    '',
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
  console.log('[RabbitMQ] Evento publicado no Exchange:', JSON.stringify(event));
}
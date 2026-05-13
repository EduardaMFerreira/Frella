import amqp, { Channel, ChannelModel } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://frella:frella@localhost:5672';
export const PROPOSTA_QUEUE = 'proposta.eventos';

let connection: ChannelModel;
let channel: Channel;

export async function getRabbitMQChannel(): Promise<Channel> {
  if (channel) return channel;

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(PROPOSTA_QUEUE, { durable: true });

  console.log('[RabbitMQ] Conectado e fila criada:', PROPOSTA_QUEUE);
  return channel;
}

export async function publishEvent(event: object): Promise<void> {
  const ch = await getRabbitMQChannel();
  ch.sendToQueue(
    PROPOSTA_QUEUE,
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
  console.log('[RabbitMQ] Evento publicado:', JSON.stringify(event));
}
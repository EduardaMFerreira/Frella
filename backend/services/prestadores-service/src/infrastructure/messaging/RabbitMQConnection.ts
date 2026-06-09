import amqp from "amqplib";
import { logger } from "../logger";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://frella:frella@localhost:5672";

export class RabbitMQConnection {
  private static connection: amqp.ChannelModel | null = null;
  private static channel: amqp.Channel | null = null;
  private static readonly EXCHANGE = "frella.events";
  private static readonly PRESTADORES_QUEUE = "prestadores.queue";
  private static readonly PRESTADORES_DLQ = "prestadores.dlq";

  static async connect(tentativa = 1): Promise<amqp.Channel> {
    if (this.channel) return this.channel;

    const MAX_TENTATIVAS = 10;
    const ESPERA_MS = Math.min(1000 * tentativa, 15000);

    try {
      logger.info(`[RabbitMQ-Prestadores] Tentativa ${tentativa} de conexão...`);

      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertExchange(this.EXCHANGE, "topic", { durable: true });
      await channel.assertQueue(this.PRESTADORES_DLQ, { durable: true });
      await channel.assertQueue(this.PRESTADORES_QUEUE, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": "",
          "x-dead-letter-routing-key": this.PRESTADORES_DLQ,
        },
      });
      await channel.bindQueue(this.PRESTADORES_QUEUE, this.EXCHANGE, "prestador.#");

      connection.on("close", () => {
        logger.warn("[RabbitMQ-Prestadores] Conexão encerrada. Reconectando...");
        this.channel = null;
        this.connection = null;
        setTimeout(() => this.connect(1), 2000);
      });

      connection.on("error", (err: Error) => {
        logger.error("[RabbitMQ-Prestadores] Erro na conexão", { error: err.message });
      });

      this.connection = connection;
      this.channel = channel;

      logger.info("[RabbitMQ-Prestadores] Conectado com sucesso!");
      return this.channel;

    } catch (err: any) {
      logger.error(`[RabbitMQ-Prestadores] Falha na tentativa ${tentativa}`, { error: err.message });

      if (tentativa >= MAX_TENTATIVAS) {
        throw new Error("[RabbitMQ-Prestadores] Número máximo de tentativas atingido.");
      }

      await new Promise((resolve) => setTimeout(resolve, ESPERA_MS));
      return this.connect(tentativa + 1);
    }
  }

  static async publish(routingKey: string, payload: unknown): Promise<void> {
    try {
      const channel = await this.connect();
      channel.publish(
        this.EXCHANGE,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
      logger.info("[RabbitMQ-Prestadores] Evento publicado", { routingKey });
    } catch (err: any) {
      logger.error("[RabbitMQ-Prestadores] Erro ao publicar evento", { routingKey, error: err.message });
      throw err;
    }
  }
}
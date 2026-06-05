import amqp from "amqplib";
import { logger } from "../logger";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://frella:frella@localhost:5672";

export class RabbitMQConnection {
  private static connection: amqp.ChannelModel | null = null;
  private static channel: amqp.Channel | null = null;
  private static readonly EXCHANGE = "frella.events";
  private static readonly CLIENTES_QUEUE = "clientes.queue";
  private static readonly CLIENTES_DLQ = "clientes.dlq";

  static async connect(tentativa = 1): Promise<amqp.Channel> {
    if (this.channel) return this.channel;

    const MAX_TENTATIVAS = 10;
    const ESPERA_MS = Math.min(1000 * tentativa, 15000);

    try {
      logger.info(`[RabbitMQ-Clientes] Tentativa ${tentativa} de conexao...`);

      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertExchange(this.EXCHANGE, "topic", { durable: true });
      await channel.assertQueue(this.CLIENTES_DLQ, { durable: true });
      await channel.assertQueue(this.CLIENTES_QUEUE, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": "",
          "x-dead-letter-routing-key": this.CLIENTES_DLQ,
        },
      });
      await channel.bindQueue(this.CLIENTES_QUEUE, this.EXCHANGE, "cliente.#");

      connection.on("close", () => {
        logger.warn("[RabbitMQ-Clientes] Conexao encerrada. Reconectando...");
        this.channel = null;
        this.connection = null;
        setTimeout(() => this.connect(1), 2000);
      });

      connection.on("error", (err: Error) => {
        logger.error("[RabbitMQ-Clientes] Erro na conexao", { error: err.message });
      });

      this.connection = connection;
      this.channel = channel;

      logger.info("[RabbitMQ-Clientes] Conectado com sucesso!");
      return this.channel;

    } catch (err: any) {
      logger.error(`[RabbitMQ-Clientes] Falha na tentativa ${tentativa}`, { error: err.message });

      if (tentativa >= MAX_TENTATIVAS) {
        throw new Error("[RabbitMQ-Clientes] Numero maximo de tentativas atingido.");
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
      logger.info("[RabbitMQ-Clientes] Evento publicado", { routingKey });
    } catch (err: any) {
      logger.error("[RabbitMQ-Clientes] Erro ao publicar evento", { routingKey, error: err.message });
      throw err;
    }
  }
}
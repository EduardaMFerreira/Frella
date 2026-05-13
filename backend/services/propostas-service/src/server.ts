import app from "./app";
import { iniciarConsumer } from './infrastructure/messaging/rabbitmq/RabbitMQConsumer';

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Propostas service rodando na porta ${PORT}`);
  iniciarConsumer().catch(console.error);
});
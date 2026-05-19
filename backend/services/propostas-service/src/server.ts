import http from 'http';
import app from './app';
import { iniciarWebSocketServer } from './infrastructure/websocket/WebSocketServer';
import { iniciarConsumer } from './infrastructure/messaging/rabbitmq/RabbitMQConsumer';

const PORT = process.env.PORT || 3004;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Propostas service rodando na porta ${PORT}`);
  iniciarWebSocketServer(server);
  iniciarConsumer().catch(console.error);
});
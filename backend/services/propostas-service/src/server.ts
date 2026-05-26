import http from 'http';
import app from './app';
import { iniciarWebSocketServer } from './infrastructure/websocket/WebSocketServer';
import { iniciarConsumer } from './infrastructure/messaging/rabbitmq/RabbitMQConsumer';
import { correlationIdMiddleware } from '../../../../shared/correlationIdMiddleware';
import { httpLoggerMiddleware } from '../../../../shared/httpLoggerMiddleware';
import { logger } from './infrastructure/logger';

app.use(correlationIdMiddleware);
app.use(httpLoggerMiddleware(logger));

const PORT = process.env.PORT || 3004;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info('Serviço iniciado', { port: PORT });
  iniciarWebSocketServer(server);
  iniciarConsumer().catch((err) => {
    logger.error('Erro ao iniciar consumer RabbitMQ', { error: err.message });
  });
});
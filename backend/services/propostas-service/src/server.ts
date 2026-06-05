import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import http from 'http';
import app from './app';
import { iniciarWebSocketServer } from './infrastructure/websocket/WebSocketServer';
import { iniciarConsumer } from './infrastructure/messaging/rabbitmq/RabbitMQConsumer';
import { correlationIdMiddleware } from '@frella/shared';
import { httpLoggerMiddleware } from '@frella/shared';
import { logger } from './infrastructure/logger';
import { runMigrations } from './infrastructure/database/migrate';

app.use(correlationIdMiddleware);
app.use(httpLoggerMiddleware(logger));

const PORT = process.env.PORT || 3004;
const server = http.createServer(app);

runMigrations().then(() => {
  server.listen(PORT, () => {
    logger.info('Serviço iniciado', { port: PORT });
    iniciarWebSocketServer(server);
    iniciarConsumer().catch((err) => {
      logger.error('Erro ao iniciar consumer RabbitMQ', { error: err.message });
    });
  });
}).catch((err) => {
  logger.error('Erro ao executar migrations', { error: err.message });
  process.exit(1);
});
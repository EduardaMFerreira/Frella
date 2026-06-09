"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const WebSocketServer_1 = require("./infrastructure/websocket/WebSocketServer");
const RabbitMQConsumer_1 = require("./infrastructure/messaging/rabbitmq/RabbitMQConsumer");
const correlationIdMiddleware_1 = require("../../../../shared/correlationIdMiddleware");
const httpLoggerMiddleware_1 = require("../../../../shared/httpLoggerMiddleware");
const logger_1 = require("./infrastructure/logger");
app_1.default.use(correlationIdMiddleware_1.correlationIdMiddleware);
app_1.default.use((0, httpLoggerMiddleware_1.httpLoggerMiddleware)(logger_1.logger));
const PORT = process.env.PORT || 3004;
const server = http_1.default.createServer(app_1.default);
server.listen(PORT, () => {
    logger_1.logger.info('Serviço iniciado', { port: PORT });
    (0, WebSocketServer_1.iniciarWebSocketServer)(server);
    (0, RabbitMQConsumer_1.iniciarConsumer)().catch((err) => {
        logger_1.logger.error('Erro ao iniciar consumer RabbitMQ', { error: err.message });
    });
});

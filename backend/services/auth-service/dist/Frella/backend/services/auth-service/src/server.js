"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const migrate_1 = require("./infrastructure/database/migrate");
const correlationIdMiddleware_1 = require("../../../../shared/correlationIdMiddleware");
const httpLoggerMiddleware_1 = require("../../../../shared/httpLoggerMiddleware");
const logger_1 = require("./infrastructure/logger");
const PORT = process.env.PORT || 3006;
app_1.default.use(correlationIdMiddleware_1.correlationIdMiddleware);
app_1.default.use((0, httpLoggerMiddleware_1.httpLoggerMiddleware)(logger_1.logger));
(0, migrate_1.runMigrations)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        logger_1.logger.info('Servico iniciado', { port: PORT });
    });
})
    .catch((err) => {
    logger_1.logger.error('Erro ao executar migrations', { error: err.message });
    process.exit(1);
});

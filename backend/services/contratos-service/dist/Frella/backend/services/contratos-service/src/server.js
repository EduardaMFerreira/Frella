"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const contratos_routes_1 = __importDefault(require("./routes/contratos.routes"));
const migrate_1 = require("./infrastructure/database/migrate");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const correlationIdMiddleware_1 = require("../../../../shared/correlationIdMiddleware");
const httpLoggerMiddleware_1 = require("../../../../shared/httpLoggerMiddleware");
const logger_1 = require("./infrastructure/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(correlationIdMiddleware_1.correlationIdMiddleware);
app.use((0, httpLoggerMiddleware_1.httpLoggerMiddleware)(logger_1.logger));
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use("/", contratos_routes_1.default);
const PORT = process.env.PORT || 3002;
(0, migrate_1.runMigrations)()
    .then(() => {
    app.listen(PORT, () => {
        logger_1.logger.info('Serviço iniciado', { port: PORT });
    });
})
    .catch((err) => {
    logger_1.logger.error('Erro ao executar migrations', { error: err.message });
    process.exit(1);
});

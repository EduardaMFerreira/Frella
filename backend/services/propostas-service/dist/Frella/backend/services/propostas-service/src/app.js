"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const propostas_routes_1 = __importDefault(require("./routes/propostas.routes"));
const WebSocketServer_1 = require("./infrastructure/websocket/WebSocketServer");
const HealthService_1 = require("./infrastructure/health/HealthService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/propostas", propostas_routes_1.default);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Liveness
app.get("/health/live", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});
// Readiness
app.get("/health/ready", async (req, res) => {
    const result = await (0, HealthService_1.getReadinessStatus)();
    const statusCode = result.status === "ok" ? 200 : 503;
    res.status(statusCode).json(result);
});
// Health geral
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
// Status do WebSocket
app.get("/ws/status", (req, res) => {
    res.json({
        status: "ok",
        clientes_conectados: (0, WebSocketServer_1.getClientCount)(),
        timestamp: new Date().toISOString(),
    });
});
app.get('/version', (req, res) => {
    res.json({
        version: process.env.npm_package_version || '1.0.0',
        service: 'propostas-service',
        environment: process.env.NODE_ENV || 'development',
        buildDate: new Date().toISOString(),
    });
});
exports.default = app;

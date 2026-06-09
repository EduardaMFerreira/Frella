"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const contratos_routes_1 = __importDefault(require("./routes/contratos.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const HealthService_1 = require("./infrastructure/health/HealthService");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/contratos", contratos_routes_1.default);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
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
exports.default = app;

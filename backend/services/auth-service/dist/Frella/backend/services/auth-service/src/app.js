"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const HealthService_1 = require("./infrastructure/health/HealthService");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const isProduction = process.env.NODE_ENV === "production";
const routesPath = isProduction
    ? "/app/dist/routes/*.js"
    : "./src/routes/*.ts";
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth Service API",
            version: "1.0.0",
            description: "Microsservico de autenticacao",
        },
        servers: [{ url: "http://localhost:3006" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [routesPath],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use("/api/auth", auth_routes_1.default);
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

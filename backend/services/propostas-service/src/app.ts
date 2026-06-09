import express from "express";
import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger";

import propostasRoutes from "./routes/propostas.routes";
import { getClientCount } from "./infrastructure/websocket/WebSocketServer";
import { getReadinessStatus } from "./infrastructure/health/HealthService";
import { register, httpRequestCounter, httpRequestDuration } from './metrics';

const app = express();

app.use(express.json());

// ── Métricas ──────────────────────────────────────────────
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path ?? req.path;
    httpRequestCounter.inc({ method: req.method, route, status: res.statusCode });
    end({ method: req.method, route, status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use("/api/propostas", propostasRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Liveness
app.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Readiness
app.get("/health/ready", async (req, res) => {
  const result = await getReadinessStatus();
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
    clientes_conectados: getClientCount(),
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

export default app;
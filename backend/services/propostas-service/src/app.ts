import express from "express";
import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger";

import propostasRoutes from "./routes/propostas.routes";
import { getClientCount } from "./infrastructure/websocket/WebSocketServer";
import { getReadinessStatus } from "./infrastructure/health/HealthService";

const app = express();

app.use(express.json());

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

export default app;
import express from "express";
import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger";

import propostasRoutes from "./routes/propostas.routes";
import { getClientCount } from "./infrastructure/websocket/WebSocketServer"; // ✅ ADICIONAR

const app = express();

app.use(express.json());

app.use("/api/propostas", propostasRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ ADICIONAR — endpoint de status do WebSocket
app.get("/ws/status", (req, res) => {
  res.json({
    status: "ok",
    clientes_conectados: getClientCount(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
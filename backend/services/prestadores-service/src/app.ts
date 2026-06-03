import express from "express";
import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec as swaggerDocument } from "./config/swagger";

import prestadoresRoutes from "./routes/prestadores.routes";
import { getReadinessStatus } from "./infrastructure/health/HealthService";

const app = express();

app.use(express.json());

app.use("/api/prestadores", prestadoresRoutes);

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

export default app;
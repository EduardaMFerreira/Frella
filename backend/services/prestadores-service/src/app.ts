import express from "express";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec as swaggerDocument } from "./config/swagger";
import { register, httpRequestCounter, httpRequestDuration } from './metrics';

import prestadoresRoutes from "./routes/prestadores.routes";
import { getReadinessStatus } from "./infrastructure/health/HealthService";

const app = express();

app.use(cors());
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
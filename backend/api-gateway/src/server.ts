import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import Redis from "ioredis";
import { auth } from "./middlewares/authMiddleware";
import { loggerMiddleware, logger } from "./middlewares/loggerMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 3 });

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// ── Rate Limiting ─────────────────────────────────────────
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em 15 minutos." },
});

const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas de autenticação. Tente novamente em 15 minutos." },
});

app.use(limiterGlobal);

// ── Documentação ──────────────────────────────────────────
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health checks do Gateway ──────────────────────────────
app.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health/ready", async (req, res) => {
  try {
    await redis.ping();
    res.status(200).json({
      status: "ok",
      service: "api-gateway",
      timestamp: new Date().toISOString(),
      dependencies: { redis: { status: "ok" } },
    });
  } catch {
    res.status(503).json({
      status: "degraded",
      service: "api-gateway",
      timestamp: new Date().toISOString(),
      dependencies: { redis: { status: "error" } },
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

// ── Rota pública — Auth (sem autenticação) ────────────────
app.use(
  "/api/v1/auth",
  limiterAuth,
  createProxyMiddleware({
    target: "http://auth-service:3006",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "/api/auth" },
  })
);

// ── Rotas protegidas — exigem JWT válido ──────────────────
app.use(
  "/api/v1/clientes",
  auth,
  createProxyMiddleware({
    target: "http://clientes-service:3001",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/clientes": "/api/clientes" },
  })
);

app.use(
  "/api/v1/prestadores",
  auth,
  createProxyMiddleware({
    target: "http://prestadores-service:3003",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/prestadores": "/api/prestadores" },
  })
);

app.use(
  "/api/v1/contratos",
  auth,
  createProxyMiddleware({
    target: "http://contratos-service:3002",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/contratos": "/api/contratos" },
  })
);

app.use(
  "/api/v1/propostas",
  auth,
  createProxyMiddleware({
    target: "http://propostas-service:3004",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/propostas": "/api/propostas" },
  })
);

app.use(
  "/api/v1/avaliacoes",
  auth,
  createProxyMiddleware({
    target: "http://avaliacoes-service:3005",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/avaliacoes": "/api/avaliacoes" },
  })
);

// ── Rota não encontrada ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada no Gateway" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Gateway iniciado", { port: PORT });
  logger.info(`Documentação disponível em http://localhost:${PORT}/docs`);
});
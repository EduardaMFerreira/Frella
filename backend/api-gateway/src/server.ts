import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import { auth } from "./middlewares/authMiddleware";
import { loggerMiddleware, logger } from "./middlewares/loggerMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// ── Rate Limiting ─────────────────────────────────────────
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas requisições. Tente novamente em 15 minutos.",
  },
});

const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas tentativas de autenticação. Tente novamente em 15 minutos.",
  },
});

app.use(limiterGlobal);

// ── Documentação ──────────────────────────────────────────
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health check do Gateway ───────────────────────────────
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
  })
);

// ── Rotas protegidas — exigem JWT válido ──────────────────
app.use(
  "/api/v1/clientes",
  auth,
  createProxyMiddleware({
    target: "http://clientes-service:3001",
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/prestadores",
  auth,
  createProxyMiddleware({
    target: "http://prestadores-service:3003",
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/contratos",
  auth,
  createProxyMiddleware({
    target: "http://contratos-service:3002",
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/propostas",
  auth,
  createProxyMiddleware({
    target: "http://propostas-service:3004",
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/avaliacoes",
  auth,
  createProxyMiddleware({
    target: "http://avaliacoes-service:3005",
    changeOrigin: true,
  })
);

// ── Rota não encontrada ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada no Gateway" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info('Gateway iniciado', { port: PORT });
  logger.info(`Documentação disponível em http://localhost:${PORT}/docs`);
});
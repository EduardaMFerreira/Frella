import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

import { logger } from "./middlewares/loggerMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());
app.use(logger);

// PROXIES (SEM pathRewrite)
app.use(
  "/api/v1/clientes",
  createProxyMiddleware({
    target: "http://clientes-service:3001",
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/contratos",
  createProxyMiddleware({
    target: "http://contratos-service:3002",
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/prestadores",
  createProxyMiddleware({
    target: "http://prestadores-service:3003",
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/propostas",
  createProxyMiddleware({
    target: "http://propostas-service:3004",
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/avaliacoes",
  createProxyMiddleware({
    target: "http://avaliacoes-service:3005",
    changeOrigin: true,
  })
);

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
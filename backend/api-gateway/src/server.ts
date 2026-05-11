import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { auth } from "./middlewares/authMiddleware";

import { logger } from "./middlewares/loggerMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(
  "/api/v1/clientes",
  auth,                          
  createProxyMiddleware({
    target: "http://clientes-service:3001",
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
  "/api/v1/prestadores",
  auth,
  createProxyMiddleware({
    target: "http://prestadores-service:3003",
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

app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: "http://auth-service:3006",
    changeOrigin: true,
  })
);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
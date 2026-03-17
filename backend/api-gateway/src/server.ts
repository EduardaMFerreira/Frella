import "./app";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

// IMPORTANDO MIDDLEWARES
import { logger } from "./middlewares/loggerMiddleware";
import { auth } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

// MIDDLEWARES
app.use(logger);
// app.use(auth); // opcional

// ROTAS DO GATEWAY

app.use(
  "/clientes",
  createProxyMiddleware({
    target: "http://clientes-service:3001",
    changeOrigin: true,
  })
);

app.use(
  "/contratos",
  createProxyMiddleware({
    target: "http://contratos-service:3002",
    changeOrigin: true,
  })
);

app.use(
  "/prestadores",
  createProxyMiddleware({
    target: "http://prestadores-service:3003",
    changeOrigin: true,
  })
);

app.use(
  "/propostas",
  createProxyMiddleware({
    target: "http://propostas-service:3004",
    changeOrigin: true,
  })
);

app.use(
  "/avaliacoes",
  createProxyMiddleware({
    target: "http://avaliacoes-service:3005",
    changeOrigin: true,
  })
);

// ERROR HANDLER SEMPRE POR ÚLTIMO
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
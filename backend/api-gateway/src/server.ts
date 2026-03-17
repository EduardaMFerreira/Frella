import "./app";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(cors());
app.use(express.json());

/*
ROTAS DO GATEWAY
cada rota redireciona para um microserviço
*/

app.use(
  "/clientes",
  createProxyMiddleware({
    target: "http://clientes-service:3001",
    changeOrigin: true
  })
);

app.use(
  "/contratos",
  createProxyMiddleware({
    target: "http://contratos-service:3002",
    changeOrigin: true
  })
);

app.use(
  "/prestadores",
  createProxyMiddleware({
    target: "http://prestadores-service:3003",
    changeOrigin: true
  })
);

app.use(
  "/propostas",
  createProxyMiddleware({
    target: "http://propostas-service:3004",
    changeOrigin: true
  })
);

app.use(
  "/avaliacoes",
  createProxyMiddleware({
    target: "http://avaliacoes-service:3005",
    changeOrigin: true
  })
);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
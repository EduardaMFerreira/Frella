import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import avaliacoesRoutes from "./routes/avaliacoes.routes";
import { runMigrations } from "./infrastructure/database/migrate";
import { startConsumers } from "./infrastructure/messaging/consumer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Avaliacoes Service API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", avaliacoesRoutes);

const PORT = process.env.PORT || 3005;

runMigrations()
  .then(async () => {
    await startConsumers();
    app.listen(PORT, () => {
      console.log(`Avaliacoes service rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao executar migrations:", err);
    process.exit(1);
  });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import avaliacoesRoutes from "./routes/avaliacoes.routes";
import { runMigrations } from "./infrastructure/database/migrate";
import { correlationIdMiddleware } from '@frella/shared';
import { httpLoggerMiddleware } from '@frella/shared';
import { logger } from './infrastructure/logger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(correlationIdMiddleware);
app.use(httpLoggerMiddleware(logger));

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
  .then(() => {
    app.listen(PORT, () => {
      logger.info('Serviço iniciado', { port: PORT });
    });
  })
  .catch((err) => {
    logger.error('Erro ao executar migrations', { error: err.message });
    process.exit(1);
  });
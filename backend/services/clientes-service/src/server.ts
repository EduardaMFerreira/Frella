import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clientesRoutes from "./routes/clientes.routes";
import { runMigrations } from "./infrastructure/database/migrate";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { correlationIdMiddleware } from '../../../../shared/correlationIdMiddleware';
import { httpLoggerMiddleware } from '../../../../shared/httpLoggerMiddleware';
import { logger } from './infrastructure/logger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(correlationIdMiddleware);
app.use(httpLoggerMiddleware(logger));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", clientesRoutes);

const PORT = process.env.PORT || 3001;

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
import app from "./app";
import { runMigrations } from "./infrastructure/database/migrate";
import { correlationIdMiddleware } from "../../../../shared/correlationIdMiddleware";
import { httpLoggerMiddleware } from "../../../../shared/httpLoggerMiddleware";
import { logger } from "./infrastructure/logger";

const PORT = process.env.PORT || 3006;

app.use(correlationIdMiddleware);
app.use(httpLoggerMiddleware(logger));

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      logger.info("Serviço iniciado", { port: PORT });
    });
  })
  .catch((err) => {
    logger.error("Erro ao executar migrations", { error: err.message });
    process.exit(1);
  });
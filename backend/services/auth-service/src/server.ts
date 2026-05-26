import app from "./app";
import { pool } from "./infrastructure/database/connection";
import { correlationIdMiddleware } from '../../../../shared/correlationIdMiddleware';
import { httpLoggerMiddleware } from '../../../../shared/httpLoggerMiddleware';
import { logger } from './infrastructure/logger';

// PORT declarado antes de usar
const PORT = process.env.PORT || 3006;

app.use(correlationIdMiddleware);
app.use(httpLoggerMiddleware(logger));

app.listen(PORT, async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  logger.info('Serviço iniciado', { port: PORT }); // substituiu o console.log
});
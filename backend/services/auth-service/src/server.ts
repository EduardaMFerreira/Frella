import app from "./app";
import { pool } from "./infrastructure/database/connection";

const PORT = process.env.PORT || 3006;

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
  console.log(`Auth service rodando na porta ${PORT}`);
});
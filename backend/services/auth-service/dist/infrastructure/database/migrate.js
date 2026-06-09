"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const connection_1 = require("./connection");
async function runMigrations() {
    await connection_1.pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
    console.log('Migration executada: create_users');
}

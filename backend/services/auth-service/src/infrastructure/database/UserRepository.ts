import { pool } from "./connection";

export const UserRepository = {
  async findByEmail(email: string) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  },

  async create(data: { email: string; password: string; role: string }) {
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [data.email, data.password, data.role]
    );
    return result.rows[0];
  },
};
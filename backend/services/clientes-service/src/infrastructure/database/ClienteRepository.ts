import { pool } from "./connection";
import { Cliente } from "../../domain/entities/Cliente";

export const ClienteRepository = {
  async findAll(): Promise<Cliente[]> {
    const result = await pool.query(
      "SELECT * FROM clientes ORDER BY created_at DESC"
    );
    return result.rows;
  },

  async findByFilter(filtros: { nome?: string; email?: string }): Promise<Cliente[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (filtros.nome) {
      conditions.push(`nome ILIKE $${idx++}`);
      values.push(`%${filtros.nome}%`);
    }
    if (filtros.email) {
      conditions.push(`email ILIKE $${idx++}`);
      values.push(`%${filtros.email}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await pool.query(
      `SELECT * FROM clientes ${where} ORDER BY created_at DESC`,
      values
    );
    return result.rows;
  },

  async findById(id: string): Promise<Cliente | null> {
    const result = await pool.query(
      "SELECT * FROM clientes WHERE id = $1",
      [id]
    );
    return result.rows[0] ?? null;
  },

  async findByEmail(email: string): Promise<Cliente | null> {
    const result = await pool.query(
      "SELECT * FROM clientes WHERE email = $1",
      [email]
    );
    return result.rows[0] ?? null;
  },

  async create(data: {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: object;
  }): Promise<Cliente> {
    const result = await pool.query(
      `INSERT INTO clientes (id, nome, email, telefone, endereco, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [data.nome, data.email, data.telefone ?? null, data.endereco ? JSON.stringify(data.endereco) : null]
    );
    return result.rows[0];
  },

  async update(
    id: string,
    data: Partial<Omit<Cliente, "id" | "created_at" | "updated_at">>
  ): Promise<Cliente> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.nome !== undefined) { fields.push(`nome = $${idx++}`); values.push(data.nome); }
    if (data.email !== undefined) { fields.push(`email = $${idx++}`); values.push(data.email); }
    if (data.telefone !== undefined) { fields.push(`telefone = $${idx++}`); values.push(data.telefone); }
    if (data.endereco !== undefined) { fields.push(`endereco = $${idx++}`); values.push(JSON.stringify(data.endereco)); }
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE clientes SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async remove(id: string): Promise<void> {
    await pool.query("DELETE FROM clientes WHERE id = $1", [id]);
  },
};
import { pool } from "./connection";
import { Prestador } from "../../domain/entities/Prestador";

export const PrestadorRepository = {
  async findAll(): Promise<Prestador[]> {
    const result = await pool.query(
      "SELECT * FROM prestadores ORDER BY created_at DESC"
    );
    return result.rows;
  },

  async findById(id: string): Promise<Prestador | null> {
    const result = await pool.query(
      "SELECT * FROM prestadores WHERE id = $1",
      [id]
    );
    return result.rows[0] ?? null;
  },

  async findByEmail(email: string): Promise<Prestador | null> {
    const result = await pool.query(
      "SELECT * FROM prestadores WHERE email = $1",
      [email]
    );
    return result.rows[0] ?? null;
  },

  async findByEspecialidade(especialidade: string): Promise<Prestador[]> {
    const result = await pool.query(
      "SELECT * FROM prestadores WHERE $1 = ANY(especialidades)",
      [especialidade]
    );
    return result.rows;
  },

  async create(data: {
    nome: string;
    email: string;
    telefone?: string;
    especialidades: string[];
    descricao?: string;
    valor_hora?: number;
    endereco?: object;
  }): Promise<Prestador> {
    const result = await pool.query(
      `INSERT INTO prestadores (id, nome, email, telefone, especialidades, descricao, valor_hora, endereco, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        data.nome,
        data.email,
        data.telefone ?? null,
        data.especialidades,
        data.descricao ?? null,
        data.valor_hora ?? null,
        data.endereco ? JSON.stringify(data.endereco) : null,
      ]
    );
    return result.rows[0];
  },

  async update(
    id: string,
    data: Partial<Omit<Prestador, "id" | "created_at" | "updated_at">>
  ): Promise<Prestador> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.nome !== undefined) { fields.push(`nome = $${idx++}`); values.push(data.nome); }
    if (data.email !== undefined) { fields.push(`email = $${idx++}`); values.push(data.email); }
    if (data.telefone !== undefined) { fields.push(`telefone = $${idx++}`); values.push(data.telefone); }
    if (data.especialidades !== undefined) { fields.push(`especialidades = $${idx++}`); values.push(data.especialidades); }
    if (data.descricao !== undefined) { fields.push(`descricao = $${idx++}`); values.push(data.descricao); }
    if (data.valor_hora !== undefined) { fields.push(`valor_hora = $${idx++}`); values.push(data.valor_hora); }
    if (data.endereco !== undefined) { fields.push(`endereco = $${idx++}`); values.push(JSON.stringify(data.endereco)); }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE prestadores SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async remove(id: string): Promise<void> {
    await pool.query("DELETE FROM prestadores WHERE id = $1", [id]);
  },
};
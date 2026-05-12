import { pool } from "./connection";
import { Avaliacao } from "../../domain/entities/Avaliacao";

export const AvaliacaoRepository = {

  async findAll(): Promise<Avaliacao[]> {
    const result = await pool.query(
      "SELECT * FROM avaliacoes ORDER BY created_at DESC"
    );

    return result.rows;
  },

  async findById(id: string): Promise<Avaliacao | null> {
    const result = await pool.query(
      "SELECT * FROM avaliacoes WHERE id = $1",
      [id]
    );

    return result.rows[0] ?? null;
  },

  async create(data: {
    nota: number;
    comentario?: string;
    cliente_id: string;
    prestador_id: string;
  }): Promise<Avaliacao> {

    const result = await pool.query(
      `INSERT INTO avaliacoes
      (id, nota, comentario, cliente_id, prestador_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
      RETURNING *`,
      [
        data.nota,
        data.comentario ?? null,
        data.cliente_id,
        data.prestador_id,
      ]
    );

    return result.rows[0];
  },

  async remove(id: string): Promise<void> {
    await pool.query(
      "DELETE FROM avaliacoes WHERE id = $1",
      [id]
    );
  },
};
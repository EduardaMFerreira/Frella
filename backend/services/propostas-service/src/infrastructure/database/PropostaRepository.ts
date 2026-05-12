import { pool } from "./connection";

import { Proposta } from "../../domain/entities/Proposta";

export const PropostaRepository = {

  async findAll(): Promise<Proposta[]> {

    const result = await pool.query(
      "SELECT * FROM propostas ORDER BY created_at DESC"
    );

    return result.rows;
  },

  async findById(
    id: string
  ): Promise<Proposta | null> {

    const result = await pool.query(
      "SELECT * FROM propostas WHERE id = $1",
      [id]
    );

    return result.rows[0] || null;
  },

  async create(data: {
    titulo: string;
    descricao: string;
    valor: number;
    status: string;
    cliente_id: string;
    prestador_id: string;
  }): Promise<Proposta> {

    const result = await pool.query(
      `
      INSERT INTO propostas (
        titulo,
        descricao,
        valor,
        status,
        cliente_id,
        prestador_id,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        NOW(),
        NOW()
      )
      RETURNING *
      `,
      [
        data.titulo,
        data.descricao,
        data.valor,
        data.status,
        data.cliente_id,
        data.prestador_id
      ]
    );

    return result.rows[0];
  },

  async updateStatus(
    id: string,
    status: string
  ): Promise<Proposta> {

    const result = await pool.query(
      `
      UPDATE propostas
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    return result.rows[0];
  },

  async remove(id: string): Promise<void> {

    await pool.query(
      "DELETE FROM propostas WHERE id = $1",
      [id]
    );
  }

};
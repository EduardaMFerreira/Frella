import { pool } from "./connection";
import { Contrato } from "../../domain/entities/Contrato";
import { StatusContrato } from "../../domain/enums/StatusContrato";

export const ContratoRepository = {
  async findAll(): Promise<Contrato[]> {
    const result = await pool.query(
      "SELECT * FROM contratos ORDER BY created_at DESC"
    );
    return result.rows;
  },

  async findById(id: string): Promise<Contrato | null> {
    const result = await pool.query(
      "SELECT * FROM contratos WHERE id = $1",
      [id]
    );
    return result.rows[0] ?? null;
  },

  async findByClienteId(cliente_id: string): Promise<Contrato[]> {
    const result = await pool.query(
      "SELECT * FROM contratos WHERE cliente_id = $1 ORDER BY created_at DESC",
      [cliente_id]
    );
    return result.rows;
  },

  async findByPrestadorId(prestador_id: string): Promise<Contrato[]> {
    const result = await pool.query(
      "SELECT * FROM contratos WHERE prestador_id = $1 ORDER BY created_at DESC",
      [prestador_id]
    );
    return result.rows;
  },

  async create(data: {
    cliente_id: string;
    prestador_id: string;
    descricao: string;
    valor: number;
    data_inicio: Date;
    data_fim: Date;
    status: StatusContrato;
  }): Promise<Contrato> {
    const result = await pool.query(
      `INSERT INTO contratos (id, cliente_id, prestador_id, descricao, valor, data_inicio, data_fim, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        data.cliente_id,
        data.prestador_id,
        data.descricao,
        data.valor,
        data.data_inicio,
        data.data_fim,
        data.status,
      ]
    );
    return result.rows[0];
  },

  async updateStatus(id: string, status: StatusContrato): Promise<Contrato> {
    const result = await pool.query(
      `UPDATE contratos SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  async remove(id: string): Promise<void> {
    await pool.query("DELETE FROM contratos WHERE id = $1", [id]);
  },
};
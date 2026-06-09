"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropostaRepository = void 0;
const connection_1 = require("./connection");
exports.PropostaRepository = {
    async findAll() {
        const result = await connection_1.pool.query("SELECT * FROM propostas ORDER BY created_at DESC");
        return result.rows;
    },
    async findById(id) {
        const result = await connection_1.pool.query("SELECT * FROM propostas WHERE id = $1", [id]);
        return result.rows[0] || null;
    },
    async create(data) {
        const result = await connection_1.pool.query(`
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
      VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      RETURNING *
      `, [
            data.titulo,
            data.descricao,
            data.valor,
            data.status,
            data.cliente_id,
            data.prestador_id
        ]);
        return result.rows[0];
    },
    async updateStatus(id, status) {
        const result = await connection_1.pool.query(`
      UPDATE propostas
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `, [status, id]);
        return result.rows[0];
    },
    async remove(id) {
        await connection_1.pool.query("DELETE FROM propostas WHERE id = $1", [id]);
    }
};

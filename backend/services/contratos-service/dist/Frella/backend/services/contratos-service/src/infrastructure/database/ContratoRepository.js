"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContratoRepository = void 0;
const connection_1 = require("./connection");
exports.ContratoRepository = {
    async findAll() {
        const result = await connection_1.pool.query("SELECT * FROM contratos ORDER BY created_at DESC");
        return result.rows;
    },
    async findById(id) {
        const result = await connection_1.pool.query("SELECT * FROM contratos WHERE id = $1", [id]);
        return result.rows[0] ?? null;
    },
    async findByClienteId(cliente_id) {
        const result = await connection_1.pool.query("SELECT * FROM contratos WHERE cliente_id = $1 ORDER BY created_at DESC", [cliente_id]);
        return result.rows;
    },
    async findByPrestadorId(prestador_id) {
        const result = await connection_1.pool.query("SELECT * FROM contratos WHERE prestador_id = $1 ORDER BY created_at DESC", [prestador_id]);
        return result.rows;
    },
    async create(data) {
        const result = await connection_1.pool.query(`INSERT INTO contratos (id, cliente_id, prestador_id, descricao, valor, data_inicio, data_fim, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`, [
            data.cliente_id,
            data.prestador_id,
            data.descricao,
            data.valor,
            data.data_inicio,
            data.data_fim,
            data.status,
        ]);
        return result.rows[0];
    },
    async updateStatus(id, status) {
        const result = await connection_1.pool.query(`UPDATE contratos SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, id]);
        return result.rows[0];
    },
    async remove(id) {
        await connection_1.pool.query("DELETE FROM contratos WHERE id = $1", [id]);
    },
};

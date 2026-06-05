"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvaliacaoRepository = void 0;
const connection_1 = require("./connection");
exports.AvaliacaoRepository = {
    async findAll() {
        const result = await connection_1.pool.query("SELECT * FROM avaliacoes ORDER BY created_at DESC");
        return result.rows;
    },
    async findById(id) {
        const result = await connection_1.pool.query("SELECT * FROM avaliacoes WHERE id = $1", [id]);
        return result.rows[0] ?? null;
    },
    async create(data) {
        const result = await connection_1.pool.query(`INSERT INTO avaliacoes
      (id, nota, comentario, cliente_id, prestador_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
      RETURNING *`, [
            data.nota,
            data.comentario ?? null,
            data.cliente_id,
            data.prestador_id,
        ]);
        return result.rows[0];
    },
    async remove(id) {
        await connection_1.pool.query("DELETE FROM avaliacoes WHERE id = $1", [id]);
    },
};

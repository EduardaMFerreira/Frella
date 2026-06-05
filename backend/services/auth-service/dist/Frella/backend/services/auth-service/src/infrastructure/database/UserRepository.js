"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const connection_1 = require("./connection");
exports.UserRepository = {
    async findByEmail(email) {
        const result = await connection_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0] || null;
    },
    async create(data) {
        const result = await connection_1.pool.query("INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role", [data.email, data.password, data.role]);
        return result.rows[0];
    },
};

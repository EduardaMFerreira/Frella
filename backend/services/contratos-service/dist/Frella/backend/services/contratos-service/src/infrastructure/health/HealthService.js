"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadinessStatus = getReadinessStatus;
const connection_1 = require("../database/connection");
const ioredis_1 = __importDefault(require("ioredis"));
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
async function checkPostgres() {
    const start = Date.now();
    try {
        await connection_1.pool.query('SELECT 1');
        return { status: 'ok', latency_ms: Date.now() - start };
    }
    catch (err) {
        return { status: 'error', error: err.message };
    }
}
async function checkRedis() {
    const start = Date.now();
    const client = new ioredis_1.default(REDIS_URL);
    try {
        await client.ping();
        return { status: 'ok', latency_ms: Date.now() - start };
    }
    catch (err) {
        return { status: 'error', error: err.message };
    }
    finally {
        client.disconnect();
    }
}
async function getReadinessStatus() {
    const [postgres, redis] = await Promise.all([
        checkPostgres(),
        checkRedis(),
    ]);
    const allOk = [postgres, redis].every(c => c.status === 'ok');
    return {
        status: allOk ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        dependencies: { postgres, redis },
    };
}

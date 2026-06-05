"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadinessStatus = getReadinessStatus;
const connection_1 = require("../database/connection");
const RedisCacheService_1 = require("../cache/RedisCacheService");
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
    try {
        await RedisCacheService_1.redisCacheService.set('health:ping', 'pong', 5);
        const result = await RedisCacheService_1.redisCacheService.get('health:ping');
        if (result !== 'pong')
            throw new Error('Valor inesperado no Redis');
        return { status: 'ok', latency_ms: Date.now() - start };
    }
    catch (err) {
        return { status: 'error', error: err.message };
    }
}
async function getReadinessStatus() {
    const [postgres, redis] = await Promise.all([
        checkPostgres(),
        checkRedis(),
    ]);
    const allOk = postgres.status === 'ok' && redis.status === 'ok';
    return {
        status: allOk ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        dependencies: { postgres, redis },
    };
}

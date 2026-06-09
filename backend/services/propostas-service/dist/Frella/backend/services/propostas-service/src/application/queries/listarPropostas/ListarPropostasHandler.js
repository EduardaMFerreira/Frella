"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarPropostasHandler = ListarPropostasHandler;
const PropostaReadRepository_1 = require("../../../infrastructure/database/PropostaReadRepository");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const cache = new RedisCacheService_1.RedisCacheService();
const TTL_LISTA = 120; // 2 minutos
async function ListarPropostasHandler(query) {
    const chave = `proposta:lista:c=${query.cliente_id ?? 'all'}:p=${query.prestador_id ?? 'all'}`;
    // 1. Tenta cache primeiro
    const cached = await cache.get(chave);
    if (cached)
        return cached;
    // 2. MISS — busca no Read Model
    const propostas = await PropostaReadRepository_1.PropostaReadRepository.listarTodas({
        cliente_id: query.cliente_id,
        prestador_id: query.prestador_id,
    });
    // 3. Armazena no cache com TTL
    await cache.set(chave, propostas, TTL_LISTA);
    return propostas;
}

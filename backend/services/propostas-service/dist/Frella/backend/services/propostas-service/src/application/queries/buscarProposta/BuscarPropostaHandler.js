"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarPropostaHandler = void 0;
const PropostaReadRepository_1 = require("../../../infrastructure/database/PropostaReadRepository");
const RedisCacheService_1 = require("../../../infrastructure/cache/RedisCacheService");
const cache = new RedisCacheService_1.RedisCacheService();
const TTL_ITEM = 300; // 5 minutos
class BuscarPropostaHandler {
    async execute(query) {
        if (!query.id?.trim())
            throw new Error("ID obrigatório");
        const chave = `proposta:item:${query.id}`;
        // 1. Tenta cache primeiro
        const cached = await cache.get(chave);
        if (cached)
            return cached;
        // 2. MISS — busca no Read Model
        const proposta = await PropostaReadRepository_1.PropostaReadRepository.buscarPorId(query.id);
        if (!proposta)
            throw new Error("Proposta não encontrada");
        // 3. Armazena no cache
        await cache.set(chave, proposta, TTL_ITEM);
        return proposta;
    }
}
exports.BuscarPropostaHandler = BuscarPropostaHandler;

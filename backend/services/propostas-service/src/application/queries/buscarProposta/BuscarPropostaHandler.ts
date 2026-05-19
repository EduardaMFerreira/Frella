import { PropostaReadRepository } from "../../../infrastructure/database/PropostaReadRepository";
import { PropostaReadModel } from "../../readModel/PropostaReadModel";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService"

const cache = new RedisCacheService();
const TTL_ITEM = 300; // 5 minutos

export class BuscarPropostaHandler {

  async execute(query: { id: string }): Promise<PropostaReadModel> {
    if (!query.id?.trim()) throw new Error("ID obrigatório");

    const chave = `proposta:item:${query.id}`;

    // 1. Tenta cache primeiro
    const cached = await cache.get<PropostaReadModel>(chave);
    if (cached) return cached;

    // 2. MISS — busca no Read Model
    const proposta = await PropostaReadRepository.buscarPorId(query.id);
    if (!proposta) throw new Error("Proposta não encontrada");

    // 3. Armazena no cache
    await cache.set(chave, proposta, TTL_ITEM);

    return proposta;
  }
}
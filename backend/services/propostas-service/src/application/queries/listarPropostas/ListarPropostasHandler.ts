import { PropostaReadRepository } from "../../../infrastructure/database/PropostaReadRepository";
import { ListarPropostasQuery } from "./ListarPropostasQuery";
import { PropostaReadModel } from "../../readModel/PropostaReadModel";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";

const cache = new RedisCacheService();
const TTL_LISTA = 120; // 2 minutos

export async function ListarPropostasHandler(
  query: ListarPropostasQuery
): Promise<PropostaReadModel[]> {

  const chave = `proposta:lista:c=${query.cliente_id ?? 'all'}:p=${query.prestador_id ?? 'all'}`;

  // 1. Tenta cache primeiro
  const cached = await cache.get<PropostaReadModel[]>(chave);
  if (cached) return cached;

  // 2. MISS — busca no Read Model
  const propostas = await PropostaReadRepository.listarTodas({
    cliente_id: query.cliente_id,
    prestador_id: query.prestador_id,
  });

  // 3. Armazena no cache com TTL
  await cache.set(chave, propostas, TTL_LISTA);

  return propostas;
}
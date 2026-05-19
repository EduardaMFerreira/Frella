import { AvaliacaoRepository } from "../../../infrastructure/database/AvaliacaoRepository";
import { Avaliacao } from "../../../domain/entities/Avaliacao";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";

const cache = new RedisCacheService();
const TTL_ITEM = 300;  // 5 minutos
const TTL_LISTA = 120; // 2 minutos

export async function BuscarAvaliacaoUseCase(id: string): Promise<Avaliacao> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const chave = `avaliacao:item:${id}`;

  const cached = await cache.get<Avaliacao>(chave);
  if (cached) return cached;

  const avaliacao = await AvaliacaoRepository.findById(id);
  if (!avaliacao) throw new Error("Avaliação não encontrada");

  await cache.set(chave, avaliacao, TTL_ITEM);

  return avaliacao;
}

export async function ListarAvaliacoesUseCase(): Promise<Avaliacao[]> {
  const chave = `avaliacao:lista:all`;

  const cached = await cache.get<Avaliacao[]>(chave);
  if (cached) return cached;

  const avaliacoes = await AvaliacaoRepository.findAll();

  await cache.set(chave, avaliacoes, TTL_LISTA);

  return avaliacoes;
}

export async function RemoverAvaliacaoUseCase(id: string): Promise<void> {
  const avaliacao = await AvaliacaoRepository.findById(id);
  if (!avaliacao) throw new Error("Avaliação não encontrada");

  await AvaliacaoRepository.remove(id);

  // Invalida cache após remoção
  await cache.invalidate(`avaliacao:item:${id}`);
  await cache.invalidatePattern('avaliacao:lista:*');
}
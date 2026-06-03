import { AvaliacaoRepository } from "../../../infrastructure/database/AvaliacaoRepository";
import { Avaliacao } from "../../../domain/entities/Avaliacao";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();
const TTL_ITEM = 300;  // 5 minutos
const TTL_LISTA = 120; // 2 minutos

export async function BuscarAvaliacaoUseCase(id: string): Promise<Avaliacao> {
  if (!id?.trim()) {
    logger.warn('Tentativa de busca sem ID');
    throw new Error("ID é obrigatório");
  }

  const chave = `avaliacao:item:${id}`;

  const cached = await cache.get<Avaliacao>(chave);
  if (cached) {
    logger.info('Avaliação retornada do cache', { avaliacaoId: id });
    return cached;
  }

  logger.info('Cache miss — buscando no banco', { avaliacaoId: id });
  const avaliacao = await AvaliacaoRepository.findById(id);
  if (!avaliacao) {
    logger.warn('Avaliação não encontrada', { avaliacaoId: id });
    throw new Error("Avaliação não encontrada");
  }

  await cache.set(chave, avaliacao, TTL_ITEM);

  return avaliacao;
}

export async function ListarAvaliacoesUseCase(): Promise<Avaliacao[]> {
  const chave = `avaliacao:lista:all`;

  const cached = await cache.get<Avaliacao[]>(chave);
  if (cached) {
    logger.info('Lista de avaliações retornada do cache');
    return cached;
  }

  logger.info('Cache miss — buscando lista no banco');
  const avaliacoes = await AvaliacaoRepository.findAll();
  logger.info('Avaliações encontradas', { total: avaliacoes.length });

  await cache.set(chave, avaliacoes, TTL_LISTA);

  return avaliacoes;
}

export async function RemoverAvaliacaoUseCase(id: string): Promise<void> {
  logger.info('Iniciando remoção de avaliação', { avaliacaoId: id });

  const avaliacao = await AvaliacaoRepository.findById(id);
  if (!avaliacao) {
    logger.warn('Avaliação não encontrada para remoção', { avaliacaoId: id });
    throw new Error("Avaliação não encontrada");
  }

  await AvaliacaoRepository.remove(id);

  await cache.invalidate(`avaliacao:item:${id}`);
  await cache.invalidatePattern('avaliacao:lista:*');

  logger.info('Avaliação removida com sucesso', { avaliacaoId: id });
}
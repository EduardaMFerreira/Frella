import { PrestadorRepository } from "../../../infrastructure/database/PrestadorRepository";
import { Prestador } from "../../../domain/entities/Prestador";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();
const TTL_ITEM = 300;  // 5 minutos
const TTL_LISTA = 120; // 2 minutos

export async function BuscarPrestadorUseCase(id: string): Promise<Prestador> {
  if (!id?.trim()) {
    logger.warn('Tentativa de busca sem ID');
    throw new Error("ID é obrigatório");
  }

  const chave = `prestador:item:${id}`;

  const cached = await cache.get<Prestador>(chave);
  if (cached) {
    logger.info('Prestador retornado do cache', { prestadorId: id });
    return cached;
  }

  logger.info('Cache miss — buscando no banco', { prestadorId: id });
  const prestador = await PrestadorRepository.findById(id);
  if (!prestador) {
    logger.warn('Prestador não encontrado', { prestadorId: id });
    throw new Error("Prestador não encontrado");
  }

  await cache.set(chave, prestador, TTL_ITEM);

  return prestador;
}

export async function ListarPrestadoresUseCase(): Promise<Prestador[]> {
  const chave = `prestador:lista:all`;

  const cached = await cache.get<Prestador[]>(chave);
  if (cached) {
    logger.info('Lista de prestadores retornada do cache');
    return cached;
  }

  logger.info('Cache miss — buscando lista no banco');
  const prestadores = await PrestadorRepository.findAll();
  logger.info('Prestadores encontrados', { total: prestadores.length });

  await cache.set(chave, prestadores, TTL_LISTA);

  return prestadores;
}

export async function ListarPorEspecialidadeUseCase(
  especialidade: string
): Promise<Prestador[]> {
  if (!especialidade?.trim()) {
    logger.warn('Busca por especialidade sem informar especialidade');
    throw new Error("Especialidade é obrigatória");
  }

  const chave = `prestador:lista:esp=${especialidade}`;

  const cached = await cache.get<Prestador[]>(chave);
  if (cached) {
    logger.info('Lista por especialidade retornada do cache', { especialidade });
    return cached;
  }

  logger.info('Cache miss — buscando por especialidade no banco', { especialidade });
  const prestadores = await PrestadorRepository.findByEspecialidade(especialidade);
  logger.info('Prestadores encontrados por especialidade', {
    especialidade,
    total: prestadores.length,
  });

  await cache.set(chave, prestadores, TTL_LISTA);

  return prestadores;
}
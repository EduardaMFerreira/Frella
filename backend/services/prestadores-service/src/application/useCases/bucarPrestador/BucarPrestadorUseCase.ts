import { PrestadorRepository } from "../../../infrastructure/database/PrestadorRepository";
import { Prestador } from "../../../domain/entities/Prestador";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";

const cache = new RedisCacheService();
const TTL_ITEM = 300;  // 5 minutos
const TTL_LISTA = 120; // 2 minutos

export async function BuscarPrestadorUseCase(id: string): Promise<Prestador> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const chave = `prestador:item:${id}`;

  const cached = await cache.get<Prestador>(chave);
  if (cached) return cached;

  const prestador = await PrestadorRepository.findById(id);
  if (!prestador) throw new Error("Prestador não encontrado");

  await cache.set(chave, prestador, TTL_ITEM);

  return prestador;
}

export async function ListarPrestadoresUseCase(): Promise<Prestador[]> {
  const chave = `prestador:lista:all`;

  const cached = await cache.get<Prestador[]>(chave);
  if (cached) return cached;

  const prestadores = await PrestadorRepository.findAll();

  await cache.set(chave, prestadores, TTL_LISTA);

  return prestadores;
}

export async function ListarPorEspecialidadeUseCase(
  especialidade: string
): Promise<Prestador[]> {
  if (!especialidade?.trim()) throw new Error("Especialidade é obrigatória");

  const chave = `prestador:lista:esp=${especialidade}`;

  const cached = await cache.get<Prestador[]>(chave);
  if (cached) return cached;

  const prestadores = await PrestadorRepository.findByEspecialidade(especialidade);

  await cache.set(chave, prestadores, TTL_LISTA);

  return prestadores;
}
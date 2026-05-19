import { PrestadorRepository } from "../../../infrastructure/database/PrestadorRepository";
import { Prestador } from "../../../domain/entities/Prestador";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";

const cache = new RedisCacheService();

export async function AtualizarPrestadorUseCase(
  id: string,
  data: Partial<Omit<Prestador, "id" | "created_at" | "updated_at">>
): Promise<Prestador> {
  const existente = await PrestadorRepository.findById(id);
  if (!existente) throw new Error("Prestador não encontrado");

  if (data.email && data.email !== existente.email) {
    const comMesmoEmail = await PrestadorRepository.findByEmail(data.email);
    if (comMesmoEmail) throw new Error("E-mail já cadastrado");
  }

  const atualizado = await PrestadorRepository.update(id, data);

  // Invalida cache após atualização
  await cache.invalidate(`prestador:item:${id}`);
  await cache.invalidatePattern('prestador:lista:*');

  return atualizado;
}

export async function RemoverPrestadorUseCase(id: string): Promise<void> {
  const existente = await PrestadorRepository.findById(id);
  if (!existente) throw new Error("Prestador não encontrado");

  await PrestadorRepository.remove(id);

  // Invalida cache após remoção
  await cache.invalidate(`prestador:item:${id}`);
  await cache.invalidatePattern('prestador:lista:*');
}
import { PrestadorRepository } from "../../../infrastructure/database/PrestadorRepository";
import { Prestador } from "../../../domain/entities/Prestador";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();

export async function AtualizarPrestadorUseCase(
  id: string,
  data: Partial<Omit<Prestador, "id" | "created_at" | "updated_at">>
): Promise<Prestador> {
  logger.info('Iniciando atualização de prestador', { prestadorId: id });

  const existente = await PrestadorRepository.findById(id);
  if (!existente) {
    logger.warn('Prestador não encontrado para atualização', { prestadorId: id });
    throw new Error("Prestador não encontrado");
  }

  if (data.email && data.email !== existente.email) {
    const comMesmoEmail = await PrestadorRepository.findByEmail(data.email);
    if (comMesmoEmail) {
      logger.warn('Tentativa de atualização com e-mail já cadastrado', { email: data.email });
      throw new Error("E-mail já cadastrado");
    }
  }

  const atualizado = await PrestadorRepository.update(id, data);

  await cache.invalidate(`prestador:item:${id}`);
  await cache.invalidatePattern('prestador:lista:*');

  logger.info('Prestador atualizado com sucesso', { prestadorId: id });

  return atualizado;
}

export async function RemoverPrestadorUseCase(id: string): Promise<void> {
  logger.info('Iniciando remoção de prestador', { prestadorId: id });

  const existente = await PrestadorRepository.findById(id);
  if (!existente) {
    logger.warn('Prestador não encontrado para remoção', { prestadorId: id });
    throw new Error("Prestador não encontrado");
  }

  await PrestadorRepository.remove(id);

  await cache.invalidate(`prestador:item:${id}`);
  await cache.invalidatePattern('prestador:lista:*');

  logger.info('Prestador removido com sucesso', { prestadorId: id });
}
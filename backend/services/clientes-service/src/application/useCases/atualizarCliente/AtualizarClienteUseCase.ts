import { ClienteRepository } from "../../../infrastructure/database/ClienteRepository";
import { Cliente } from "../../../domain/entities/Cliente";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();

export async function AtualizarClienteUseCase(
  id: string,
  data: Partial<Omit<Cliente, "id" | "created_at" | "updated_at">>
): Promise<Cliente> {
  logger.info('Iniciando atualização de cliente', { clienteId: id });

  if (!id?.trim()) {
    logger.warn('Tentativa de atualização sem ID');
    throw new Error("ID é obrigatório");
  }

  const existente = await ClienteRepository.findById(id);
  if (!existente) {
    logger.warn('Cliente não encontrado para atualização', { clienteId: id });
    throw new Error("Cliente não encontrado");
  }

  if (data.email && data.email !== existente.email) {
    const comMesmoEmail = await ClienteRepository.findByEmail(data.email);
    if (comMesmoEmail) {
      logger.warn('Tentativa de atualização com e-mail já cadastrado', { email: data.email });
      throw new Error("E-mail já cadastrado");
    }
  }

  const atualizado = await ClienteRepository.update(id, data);

  await cache.invalidate(`cliente:item:${id}`);
  await cache.invalidatePattern('cliente:lista:*');

  logger.info('Cliente atualizado com sucesso', { clienteId: id });

  return atualizado;
}
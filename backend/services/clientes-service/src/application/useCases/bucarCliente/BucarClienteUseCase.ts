import { ClienteRepository } from "../../../infrastructure/database/ClienteRepository";
import { Cliente } from "../../../domain/entities/Cliente";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();
const TTL_ITEM = 300;
const TTL_LISTA = 120;

export async function BuscarClienteUseCase(id: string): Promise<Cliente> {
  if (!id?.trim()) {
    logger.warn('Tentativa de busca sem ID');
    throw new Error("ID é obrigatório");
  }
  const chave = `cliente:item:${id}`;
  const cached = await cache.get<Cliente>(chave);
  if (cached) {
    logger.info('Cliente retornado do cache', { clienteId: id });
    return cached;
  }
  logger.info('Cache miss — buscando no banco', { clienteId: id });
  const cliente = await ClienteRepository.findById(id);
  if (!cliente) {
    logger.warn('Cliente não encontrado', { clienteId: id });
    throw new Error("Cliente não encontrado");
  }
  await cache.set(chave, cliente, TTL_ITEM);
  return cliente;
}

export async function ListarClientesUseCase(filtros?: { nome?: string; email?: string }): Promise<Cliente[]> {
  const temFiltro = filtros?.nome || filtros?.email;
  const chave = temFiltro
    ? `cliente:lista:${filtros?.nome ?? ''}:${filtros?.email ?? ''}`
    : `cliente:lista:all`;

  const cached = await cache.get<Cliente[]>(chave);
  if (cached) {
    logger.info('Lista de clientes retornada do cache');
    return cached;
  }
  logger.info('Cache miss — buscando lista no banco');
  const clientes = temFiltro
    ? await ClienteRepository.findByFilter(filtros!)
    : await ClienteRepository.findAll();

  logger.info('Clientes encontrados', { total: clientes.length });
  await cache.set(chave, clientes, TTL_LISTA);
  return clientes;
}

export async function AtualizarClienteUseCase(
  id: string,
  data: Partial<Omit<Cliente, "id" | "created_at" | "updated_at">>
): Promise<Cliente> {
  logger.info('Iniciando atualização de cliente', { clienteId: id });
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

export async function RemoverClienteUseCase(id: string): Promise<void> {
  logger.info('Iniciando remoção de cliente', { clienteId: id });
  const existente = await ClienteRepository.findById(id);
  if (!existente) {
    logger.warn('Cliente não encontrado para remoção', { clienteId: id });
    throw new Error("Cliente não encontrado");
  }
  await ClienteRepository.remove(id);
  await cache.invalidate(`cliente:item:${id}`);
  await cache.invalidatePattern('cliente:lista:*');
  logger.info('Cliente removido com sucesso', { clienteId: id });
}
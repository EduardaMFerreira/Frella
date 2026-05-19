import { ClienteRepository } from "../../../infrastructure/database/ClienteRepository";
import { Cliente } from "../../../domain/entities/Cliente";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";

const cache = new RedisCacheService();
const TTL_ITEM = 300;  // 5 minutos
const TTL_LISTA = 120; // 2 minutos

export async function BuscarClienteUseCase(id: string): Promise<Cliente> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const chave = `cliente:item:${id}`;

  // 1. Tenta cache primeiro
  const cached = await cache.get<Cliente>(chave);
  if (cached) return cached;

  // 2. MISS — busca no banco
  const cliente = await ClienteRepository.findById(id);
  if (!cliente) throw new Error("Cliente não encontrado");

  // 3. Armazena no cache
  await cache.set(chave, cliente, TTL_ITEM);

  return cliente;
}

export async function ListarClientesUseCase(): Promise<Cliente[]> {
  const chave = `cliente:lista:all`;

  // 1. Tenta cache primeiro
  const cached = await cache.get<Cliente[]>(chave);
  if (cached) return cached;

  // 2. MISS — busca no banco
  const clientes = await ClienteRepository.findAll();

  // 3. Armazena no cache
  await cache.set(chave, clientes, TTL_LISTA);

  return clientes;
}

export async function AtualizarClienteUseCase(
  id: string,
  data: Partial<Omit<Cliente, "id" | "created_at" | "updated_at">>
): Promise<Cliente> {
  const existente = await ClienteRepository.findById(id);
  if (!existente) throw new Error("Cliente não encontrado");

  if (data.email && data.email !== existente.email) {
    const comMesmoEmail = await ClienteRepository.findByEmail(data.email);
    if (comMesmoEmail) throw new Error("E-mail já cadastrado");
  }

  const atualizado = await ClienteRepository.update(id, data);

  // Invalida cache após atualização
  await cache.invalidate(`cliente:item:${id}`);
  await cache.invalidatePattern('cliente:lista:*');

  return atualizado;
}

export async function RemoverClienteUseCase(id: string): Promise<void> {
  const existente = await ClienteRepository.findById(id);
  if (!existente) throw new Error("Cliente não encontrado");

  await ClienteRepository.remove(id);

  // Invalida cache após remoção
  await cache.invalidate(`cliente:item:${id}`);
  await cache.invalidatePattern('cliente:lista:*');
}
import { ClienteRepository } from "../../../infrastructure/database/ClienteRepository";
import { Cliente } from "../../../domain/entities/Cliente";

export async function BuscarClienteUseCase(id: string): Promise<Cliente> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const cliente = await ClienteRepository.findById(id);
  if (!cliente) throw new Error("Cliente não encontrado");

  return cliente;
}

export async function ListarClientesUseCase(): Promise<Cliente[]> {
  return ClienteRepository.findAll();
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

  return ClienteRepository.update(id, data);
}

export async function RemoverClienteUseCase(id: string): Promise<void> {
  const existente = await ClienteRepository.findById(id);
  if (!existente) throw new Error("Cliente não encontrado");

  await ClienteRepository.remove(id);
}
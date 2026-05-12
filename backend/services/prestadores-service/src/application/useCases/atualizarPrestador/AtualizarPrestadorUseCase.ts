import { PrestadorRepository } from "../../../infrastructure/database/PrestadorRepository";
import { Prestador } from "../../../domain/entities/Prestador";

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

  return PrestadorRepository.update(id, data);
}

export async function RemoverPrestadorUseCase(id: string): Promise<void> {
  const existente = await PrestadorRepository.findById(id);
  if (!existente) throw new Error("Prestador não encontrado");

  await PrestadorRepository.remove(id);
}
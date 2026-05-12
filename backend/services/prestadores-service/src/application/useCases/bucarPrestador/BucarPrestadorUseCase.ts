import { PrestadorRepository } from "../../../infrastructure/database/PrestadorRepository";
import { Prestador } from "../../../domain/entities/Prestador";

export async function BuscarPrestadorUseCase(id: string): Promise<Prestador> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const prestador = await PrestadorRepository.findById(id);
  if (!prestador) throw new Error("Prestador não encontrado");

  return prestador;
}

export async function ListarPrestadoresUseCase(): Promise<Prestador[]> {
  return PrestadorRepository.findAll();
}

export async function ListarPorEspecialidadeUseCase(especialidade: string): Promise<Prestador[]> {
  if (!especialidade?.trim()) throw new Error("Especialidade é obrigatória");
  return PrestadorRepository.findByEspecialidade(especialidade);
}
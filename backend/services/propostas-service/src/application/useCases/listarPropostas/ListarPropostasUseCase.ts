import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { Proposta } from "../../../domain/entities/Proposta";

export async function BuscarPropostaUseCase(
  id: string
): Promise<Proposta> {

  if (!id?.trim()) {
    throw new Error("ID é obrigatório");
  }

  const proposta = await PropostaRepository.findById(id);

  if (!proposta) {
    throw new Error("Proposta não encontrada");
  }

  return proposta;
}

export async function ListarPropostasUseCase(): Promise<Proposta[]> {
  return PropostaRepository.findAll();
}

export async function RemoverPropostaUseCase(
  id: string
): Promise<void> {

  const proposta = await PropostaRepository.findById(id);

  if (!proposta) {
    throw new Error("Proposta não encontrada");
  }

  await PropostaRepository.remove(id);
}
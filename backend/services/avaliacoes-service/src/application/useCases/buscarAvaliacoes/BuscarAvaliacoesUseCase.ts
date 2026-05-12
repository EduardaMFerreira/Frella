import { AvaliacaoRepository } from "../../../infrastructure/database/AvaliacaoRepository";

import { Avaliacao } from "../../../domain/entities/Avaliacao";

export async function BuscarAvaliacaoUseCase(
  id: string
): Promise<Avaliacao> {

  if (!id?.trim()) {
    throw new Error("ID é obrigatório");
  }

  const avaliacao = await AvaliacaoRepository.findById(id);

  if (!avaliacao) {
    throw new Error("Avaliação não encontrada");
  }

  return avaliacao;

}

export async function ListarAvaliacoesUseCase(): Promise<Avaliacao[]> {

  return AvaliacaoRepository.findAll();

}

export async function RemoverAvaliacaoUseCase(
  id: string
): Promise<void> {

  const avaliacao = await AvaliacaoRepository.findById(id);

  if (!avaliacao) {
    throw new Error("Avaliação não encontrada");
  }

  await AvaliacaoRepository.remove(id);

}
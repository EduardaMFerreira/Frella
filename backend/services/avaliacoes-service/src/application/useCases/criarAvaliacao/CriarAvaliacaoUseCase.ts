import { AvaliacaoRepository } from "../../../infrastructure/database/AvaliacaoRepository";
import { CriarAvaliacaoDTO } from "./CriarAvaliacaoDTO";
import { Avaliacao } from "../../../domain/entities/Avaliacao";

export async function CriarAvaliacaoUseCase(
  data: CriarAvaliacaoDTO
): Promise<Avaliacao> {

  if (!data.nota) {
    throw new Error("Nota é obrigatória");
  }

  if (!data.cliente_id) {
    throw new Error("Cliente é obrigatório");
  }

  if (!data.prestador_id) {
    throw new Error("Prestador é obrigatório");
  }

  if (data.nota < 1 || data.nota > 5) {
    throw new Error("Nota deve ser entre 1 e 5");
  }

  return AvaliacaoRepository.create({
    nota: data.nota,
    comentario: data.comentario,
    cliente_id: data.cliente_id,
    prestador_id: data.prestador_id,
  });

}
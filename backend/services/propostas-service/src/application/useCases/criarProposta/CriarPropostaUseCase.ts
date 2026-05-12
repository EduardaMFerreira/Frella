import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { CriarPropostaDTO } from "./CriarPropostaDTO";
import { Proposta } from "../../../domain/entities/Proposta";

export async function CriarPropostaUseCase(
  data: CriarPropostaDTO
): Promise<Proposta> {

  if (!data.titulo) {
    throw new Error("Título é obrigatório");
  }

  if (!data.descricao) {
    throw new Error("Descrição é obrigatória");
  }

  if (!data.valor || data.valor <= 0) {
    throw new Error("Valor inválido");
  }

  if (!data.cliente_id) {
    throw new Error("Cliente é obrigatório");
  }

  if (!data.prestador_id) {
    throw new Error("Prestador é obrigatório");
  }

  return PropostaRepository.create({
    titulo: data.titulo,
    descricao: data.descricao,
    valor: data.valor,
    cliente_id: data.cliente_id,
    prestador_id: data.prestador_id,
    status: "PENDENTE",
  });

}
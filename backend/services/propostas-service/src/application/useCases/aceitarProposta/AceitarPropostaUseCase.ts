import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";

import { StatusProposta } from "../../../domain/enums/StatusProposta";

import { Proposta } from "../../../domain/entities/Proposta";

export async function AceitarPropostaUseCase(
  id: string
): Promise<Proposta> {

  const proposta = await PropostaRepository.findById(id);

  if (!proposta) {
    throw new Error("Proposta não encontrada");
  }

  if (proposta.status !== StatusProposta.PENDENTE) {
    throw new Error("Apenas propostas pendentes podem ser aceitas");
  }

  return PropostaRepository.updateStatus(
    id,
    StatusProposta.ACEITA
  );
}
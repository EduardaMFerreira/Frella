import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { AceitarPropostaCommand } from "./AceitarPropostaCommand";
import { Proposta } from "../../../domain/entities/Proposta";

export async function AceitarPropostaHandler(
  command: AceitarPropostaCommand
): Promise<Proposta | null> {

  if (!command.proposta_id) {
    throw new Error("ID da proposta é obrigatório");
  }

  const proposta = await PropostaRepository.findById(
    command.proposta_id
  );

  if (!proposta) {
    throw new Error("Proposta não encontrada");
  }

  proposta.status = "ACEITA";

  return proposta;
}
import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { RemoverPropostaCommand } from "./RemoverPropostaCommand";

export async function RemoverPropostaHandler(
  command: RemoverPropostaCommand
): Promise<void> {

  const proposta = await PropostaRepository.findById(
    command.id
  );

  if (!proposta) {
    throw new Error("Proposta não encontrada");
  }

  await PropostaRepository.remove(command.id);
}
import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { PropostaDto } from "../../dto/PropostaDto";
import { toPropostaDto } from "../../mappings/PropostaMapper";

export class BuscarPropostaHandler {

  async execute(query: { id: string }): Promise<PropostaDto> {
    if (!query.id?.trim()) {
      throw new Error("ID obrigatório");
    }

    const proposta = await PropostaRepository.findById(query.id);

    if (!proposta) {
      throw new Error("Proposta não encontrada");
    }

    return toPropostaDto(proposta);
  }
}
import { PropostaReadRepository } from "../../../infrastructure/database/PropostaReadRepository";
import { PropostaReadModel } from "../../readModel/PropostaReadModel";

export class BuscarPropostaHandler {

  async execute(query: { id: string }): Promise<PropostaReadModel> {
    if (!query.id?.trim()) {
      throw new Error("ID obrigatório");
    }

    // ✅ Lê do Read Model — não do banco de escrita
    const proposta = await PropostaReadRepository.buscarPorId(query.id);

    if (!proposta) {
      throw new Error("Proposta não encontrada");
    }

    return proposta;
  }
}
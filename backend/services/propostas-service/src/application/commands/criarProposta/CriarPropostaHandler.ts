import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { validarCriarProposta } from "../../validators/CriarPropostaValidator";
import { CriarPropostaCommand } from "./CriarPropostaCommand";
import { Proposta } from "../../../domain/entities/Proposta";

export class CriarPropostaHandler {

  async execute(cmd: CriarPropostaCommand): Promise<Proposta> {
    validarCriarProposta(cmd);

    return await PropostaRepository.create({
      titulo: cmd.titulo,
      descricao: cmd.descricao,
      valor: cmd.valor,
      status: "Criada",
      cliente_id: cmd.cliente_id,
      prestador_id: cmd.prestador_id
    });
  }
}
import { Proposta } from "../../domain/entities/Proposta";
import { PropostaDto } from "../dto/PropostaDto";

export function toPropostaDto(p: Proposta): PropostaDto {
  return {
    id: p.id,
    titulo: p.titulo,
    descricao: p.descricao,
    valor: p.valor,
    status: p.status
  };
}
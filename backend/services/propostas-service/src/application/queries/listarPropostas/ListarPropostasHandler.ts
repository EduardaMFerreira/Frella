import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { ListarPropostasQuery } from "./ListarPropostasQuery";
import { Proposta } from "../../../domain/entities/Proposta";

export async function ListarPropostasHandler(
  query: ListarPropostasQuery
): Promise<Proposta[]> {

  return PropostaRepository.findAll();
}
import { PropostaReadRepository } from "../../../infrastructure/database/PropostaReadRepository";
import { ListarPropostasQuery } from "./ListarPropostasQuery";
import { PropostaReadModel } from "../../readModel/PropostaReadModel";

export async function ListarPropostasHandler(
  query: ListarPropostasQuery
): Promise<PropostaReadModel[]> {
  // ✅ Filtro feito direto no banco — não em memória
  return PropostaReadRepository.listarTodas({
    cliente_id: query.cliente_id,
    prestador_id: query.prestador_id,
  });
}
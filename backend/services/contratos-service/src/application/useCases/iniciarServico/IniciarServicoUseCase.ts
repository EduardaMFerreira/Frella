import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";

export async function IniciarServicoUseCase(id: string): Promise<Contrato> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) throw new Error("Contrato não encontrado");

  if (contrato.status !== StatusContrato.PENDENTE)
    throw new Error("Apenas contratos pendentes podem ser iniciados");

  return ContratoRepository.updateStatus(id, StatusContrato.EM_ANDAMENTO);
}
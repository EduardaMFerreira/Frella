import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";

export async function FinalizarServicoUseCase(id: string): Promise<Contrato> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) throw new Error("Contrato não encontrado");

  if (contrato.status !== StatusContrato.EM_ANDAMENTO)
    throw new Error("Apenas contratos em andamento podem ser finalizados");

  return ContratoRepository.updateStatus(id, StatusContrato.FINALIZADO);
}

export async function CancelarContratoUseCase(id: string): Promise<Contrato> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) throw new Error("Contrato não encontrado");

  if (contrato.status === StatusContrato.FINALIZADO)
    throw new Error("Contratos finalizados não podem ser cancelados");

  return ContratoRepository.updateStatus(id, StatusContrato.CANCELADO);
}
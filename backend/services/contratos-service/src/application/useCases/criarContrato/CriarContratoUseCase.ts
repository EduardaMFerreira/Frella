import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { PeriodoServico } from "../../../domain/valueObjects/PeriodoServico";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";

export interface CriarContratoDTO {
  cliente_id: string;
  prestador_id: string;
  descricao: string;
  valor: number;
  data_inicio: string;
  data_fim: string;
}

export async function CriarContratoUseCase(data: CriarContratoDTO): Promise<Contrato> {
  if (!data.cliente_id?.trim()) throw new Error("cliente_id é obrigatório");
  if (!data.prestador_id?.trim()) throw new Error("prestador_id é obrigatório");
  if (!data.descricao?.trim()) throw new Error("Descrição é obrigatória");
  if (!data.valor || data.valor <= 0) throw new Error("Valor deve ser maior que zero");

  const periodo = PeriodoServico.create(data.data_inicio, data.data_fim);

  return ContratoRepository.create({
    cliente_id: data.cliente_id,
    prestador_id: data.prestador_id,
    descricao: data.descricao.trim(),
    valor: data.valor,
    data_inicio: periodo.getDataInicio(),
    data_fim: periodo.getDataFim(),
    status: StatusContrato.PENDENTE,
  });
}
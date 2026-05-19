import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { PeriodoServico } from "../../../domain/valueObjects/PeriodoServico";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { ContratoCriadoEvent } from "../../../infrastructure/messaging/events/ContratoCriadoEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";

const cache = new RedisCacheService();

export interface CriarContratoDTO {
  cliente_id: string;
  prestador_id: string;
  descricao: string;
  valor: number;
  data_inicio: string;
  data_fim: string;
}

export async function CriarContratoUseCase(
  data: CriarContratoDTO
): Promise<Contrato> {
  if (!data.cliente_id?.trim()) throw new Error("cliente_id é obrigatório");
  if (!data.prestador_id?.trim()) throw new Error("prestador_id é obrigatório");
  if (!data.descricao?.trim()) throw new Error("Descrição é obrigatória");
  if (!data.valor || data.valor <= 0) throw new Error("Valor deve ser maior que zero");

  const periodo = PeriodoServico.create(data.data_inicio, data.data_fim);

  const contrato = await ContratoRepository.create({
    cliente_id: data.cliente_id,
    prestador_id: data.prestador_id,
    descricao: data.descricao.trim(),
    valor: data.valor,
    data_inicio: periodo.getDataInicio(),
    data_fim: periodo.getDataFim(),
    status: StatusContrato.PENDENTE,
  });

  // Publica evento
  const evento: ContratoCriadoEvent = {
    tipo: 'contrato.criado',
    contrato_id: contrato.id,
    cliente_id: contrato.cliente_id,
    prestador_id: contrato.prestador_id,
    descricao: contrato.descricao,
    valor: contrato.valor,
    data_inicio: contrato.data_inicio,
    data_fim: contrato.data_fim,
    status: contrato.status,
    created_at: contrato.created_at,
  };
  await publishEvent(evento);

  // Invalida lista em cache
  await cache.invalidatePattern('contrato:lista:*');

  return contrato;
}
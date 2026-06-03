import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { PeriodoServico } from "../../../domain/valueObjects/PeriodoServico";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { ContratoCriadoEvent } from "../../../infrastructure/messaging/events/ContratoCriadoEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";
import { logger } from "../../../infrastructure/logger";

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
  logger.info('Iniciando criação de contrato', {
    clienteId: data.cliente_id,
    prestadorId: data.prestador_id,
    valor: data.valor,
  });

  if (!data.cliente_id?.trim()) {
    logger.warn('Criação de contrato sem cliente_id');
    throw new Error("cliente_id é obrigatório");
  }
  if (!data.prestador_id?.trim()) {
    logger.warn('Criação de contrato sem prestador_id');
    throw new Error("prestador_id é obrigatório");
  }
  if (!data.descricao?.trim()) {
    logger.warn('Criação de contrato sem descrição');
    throw new Error("Descrição é obrigatória");
  }
  if (!data.valor || data.valor <= 0) {
    logger.warn('Criação de contrato com valor inválido', { valor: data.valor });
    throw new Error("Valor deve ser maior que zero");
  }

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
  logger.info('Evento contrato.criado publicado', { contratoId: contrato.id });

  await cache.invalidatePattern('contrato:lista:*');

  logger.info('Contrato criado com sucesso', { contratoId: contrato.id });

  return contrato;
}
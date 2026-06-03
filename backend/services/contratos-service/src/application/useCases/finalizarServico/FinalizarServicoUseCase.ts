import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { ServicoFinalizadoEvent } from "../../../infrastructure/messaging/events/ServicoFinalizadoEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();

export async function FinalizarServicoUseCase(id: string): Promise<Contrato> {
  logger.info('Iniciando finalização de serviço', { contratoId: id });

  if (!id?.trim()) {
    logger.warn('Finalização sem ID');
    throw new Error("ID é obrigatório");
  }

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) {
    logger.warn('Contrato não encontrado para finalização', { contratoId: id });
    throw new Error("Contrato não encontrado");
  }

  if (contrato.status !== StatusContrato.EM_ANDAMENTO) {
    logger.warn('Tentativa de finalizar contrato fora do status permitido', {
      contratoId: id,
      statusAtual: contrato.status,
    });
    throw new Error("Apenas contratos em andamento podem ser finalizados");
  }

  const atualizado = await ContratoRepository.updateStatus(id, StatusContrato.FINALIZADO);

  const evento: ServicoFinalizadoEvent = {
    tipo: 'servico.finalizado',
    contrato_id: atualizado.id,
    cliente_id: atualizado.cliente_id,
    prestador_id: atualizado.prestador_id,
    status: atualizado.status,
    updated_at: atualizado.updated_at,
  };

  await publishEvent(evento);
  logger.info('Evento servico.finalizado publicado', { contratoId: id });

  await cache.invalidate(`contrato:item:${id}`);
  await cache.invalidatePattern('contrato:lista:*');

  logger.info('Serviço finalizado com sucesso', { contratoId: id });

  return atualizado;
}

export async function CancelarContratoUseCase(id: string): Promise<Contrato> {
  logger.info('Iniciando cancelamento de contrato', { contratoId: id });

  if (!id?.trim()) {
    logger.warn('Cancelamento sem ID');
    throw new Error("ID é obrigatório");
  }

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) {
    logger.warn('Contrato não encontrado para cancelamento', { contratoId: id });
    throw new Error("Contrato não encontrado");
  }

  if (contrato.status === StatusContrato.FINALIZADO) {
    logger.warn('Tentativa de cancelar contrato já finalizado', {
      contratoId: id,
      statusAtual: contrato.status,
    });
    throw new Error("Contratos finalizados não podem ser cancelados");
  }

  const atualizado = await ContratoRepository.updateStatus(id, StatusContrato.CANCELADO);

  await cache.invalidate(`contrato:item:${id}`);
  await cache.invalidatePattern('contrato:lista:*');

  logger.info('Contrato cancelado com sucesso', { contratoId: id });

  return atualizado;
}
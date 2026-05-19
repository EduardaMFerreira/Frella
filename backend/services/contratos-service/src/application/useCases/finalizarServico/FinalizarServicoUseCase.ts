import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { ServicoFinalizadoEvent } from "../../../infrastructure/messaging/events/ServicoFinalizadoEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";

const cache = new RedisCacheService();

export async function FinalizarServicoUseCase(id: string): Promise<Contrato> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) throw new Error("Contrato não encontrado");

  if (contrato.status !== StatusContrato.EM_ANDAMENTO)
    throw new Error("Apenas contratos em andamento podem ser finalizados");

  const atualizado = await ContratoRepository.updateStatus(
    id, StatusContrato.FINALIZADO
  );

  const evento: ServicoFinalizadoEvent = {
    tipo: 'servico.finalizado',
    contrato_id: atualizado.id,
    cliente_id: atualizado.cliente_id,
    prestador_id: atualizado.prestador_id,
    status: atualizado.status,
    updated_at: atualizado.updated_at,
  };
  await publishEvent(evento);

  // Invalida cache após atualização
  await cache.invalidate(`contrato:item:${id}`);
  await cache.invalidatePattern('contrato:lista:*');

  return atualizado;
}

export async function CancelarContratoUseCase(id: string): Promise<Contrato> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) throw new Error("Contrato não encontrado");

  if (contrato.status === StatusContrato.FINALIZADO)
    throw new Error("Contratos finalizados não podem ser cancelados");

  const atualizado = await ContratoRepository.updateStatus(
    id, StatusContrato.CANCELADO
  );

  // Invalida cache após cancelamento
  await cache.invalidate(`contrato:item:${id}`);
  await cache.invalidatePattern('contrato:lista:*');

  return atualizado;
}
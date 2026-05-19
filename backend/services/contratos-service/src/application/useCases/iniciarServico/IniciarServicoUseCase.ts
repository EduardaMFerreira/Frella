import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { ServicoIniciadoEvent } from "../../../infrastructure/messaging/events/ServicoIniciadoEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";

const cache = new RedisCacheService();

export async function IniciarServicoUseCase(id: string): Promise<Contrato> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) throw new Error("Contrato não encontrado");

  if (contrato.status !== StatusContrato.PENDENTE)
    throw new Error("Apenas contratos pendentes podem ser iniciados");

  const atualizado = await ContratoRepository.updateStatus(
    id, StatusContrato.EM_ANDAMENTO
  );

  const evento: ServicoIniciadoEvent = {
    tipo: 'servico.iniciado',
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
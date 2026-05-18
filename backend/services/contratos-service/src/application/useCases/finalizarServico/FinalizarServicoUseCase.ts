import { ContratoRepository } from "../../../infrastructure/database/ContratoRepository";
import { StatusContrato } from "../../../domain/enums/StatusContrato";
import { Contrato } from "../../../domain/entities/Contrato";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { ServicoFinalizadoEvent } from "../../../infrastructure/messaging/events/ServicoFinalizadoEvent";

export async function FinalizarServicoUseCase(id: string): Promise<Contrato> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) throw new Error("Contrato não encontrado");

  if (contrato.status !== StatusContrato.EM_ANDAMENTO)
    throw new Error("Apenas contratos em andamento podem ser finalizados");

  const atualizado = await ContratoRepository.updateStatus(id, StatusContrato.FINALIZADO);

  // ✅ Publica evento no RabbitMQ
  const evento: ServicoFinalizadoEvent = {
    tipo: 'servico.finalizado',
    contrato_id: atualizado.id,
    cliente_id: atualizado.cliente_id,
    prestador_id: atualizado.prestador_id,
    status: atualizado.status,
    updated_at: atualizado.updated_at,
  };
  await publishEvent(evento);

  return atualizado;
}

export async function CancelarContratoUseCase(id: string): Promise<Contrato> {
  if (!id?.trim()) throw new Error("ID é obrigatório");

  const contrato = await ContratoRepository.findById(id);
  if (!contrato) throw new Error("Contrato não encontrado");

  if (contrato.status === StatusContrato.FINALIZADO)
    throw new Error("Contratos finalizados não podem ser cancelados");

  return ContratoRepository.updateStatus(id, StatusContrato.CANCELADO);
}
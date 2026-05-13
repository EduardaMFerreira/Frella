import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { RemoverPropostaCommand } from "./RemoverPropostaCommand";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { PropostaRemovidaEvent } from "../../../infrastructure/messaging/events/PropostaRemovidaEvent";

export async function RemoverPropostaHandler(
  command: RemoverPropostaCommand
): Promise<void> {
  const proposta = await PropostaRepository.findById(command.id);
  if (!proposta) {
    throw new Error("Proposta não encontrada");
  }
  await PropostaRepository.remove(command.id);

  const evento: PropostaRemovidaEvent = {
    tipo: 'proposta.removida',
    proposta_id: command.id,
  };
  await publishEvent(evento);
}
import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { RemoverPropostaCommand } from "./RemoverPropostaCommand";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { PropostaRemovidaEvent } from "../../../infrastructure/messaging/events/PropostaRemovidaEvent";
import { logger } from "../../../infrastructure/logger";

export async function RemoverPropostaHandler(
  command: RemoverPropostaCommand
): Promise<void> {
  logger.info('Iniciando remoção de proposta', { propostaId: command.id });

  const proposta = await PropostaRepository.findById(command.id);
  if (!proposta) {
    logger.warn('Proposta não encontrada para remoção', { propostaId: command.id });
    throw new Error("Proposta não encontrada");
  }

  await PropostaRepository.remove(command.id);

  const evento: PropostaRemovidaEvent = {
    tipo: 'proposta.removida',
    proposta_id: command.id,
  };

  await publishEvent(evento);
  logger.info('Evento proposta.removida publicado', { propostaId: command.id });

  logger.info('Proposta removida com sucesso', { propostaId: command.id });
}
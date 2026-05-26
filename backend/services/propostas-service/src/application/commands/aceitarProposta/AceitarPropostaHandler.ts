import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { AceitarPropostaCommand } from "./AceitarPropostaCommand";
import { Proposta } from "../../../domain/entities/Proposta";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { PropostaAceitaEvent } from "../../../infrastructure/messaging/events/PropostaAceitaEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();

export async function AceitarPropostaHandler(
  command: AceitarPropostaCommand
): Promise<Proposta> {
  logger.info('Iniciando aceitação de proposta', { propostaId: command.proposta_id });

  if (!command.proposta_id) {
    logger.warn('Aceitação sem ID da proposta');
    throw new Error("ID da proposta é obrigatório");
  }

  const proposta = await PropostaRepository.findById(command.proposta_id);
  if (!proposta) {
    logger.warn('Proposta não encontrada para aceitação', { propostaId: command.proposta_id });
    throw new Error("Proposta não encontrada");
  }

  if (proposta.status === "ACEITA") {
    logger.warn('Tentativa de aceitar proposta já aceita', { propostaId: command.proposta_id });
    throw new Error("Proposta já foi aceita");
  }

  const propostaAtualizada = await PropostaRepository.updateStatus(
    command.proposta_id, "ACEITA"
  );

  const evento: PropostaAceitaEvent = {
    tipo: "proposta.aceita",
    proposta_id: propostaAtualizada.id,
    status: propostaAtualizada.status,
    updated_at: propostaAtualizada.updated_at,
  };

  await publishEvent(evento);
  logger.info('Evento proposta.aceita publicado', { propostaId: command.proposta_id });

  await cache.invalidate(`proposta:item:${command.proposta_id}`);
  await cache.invalidatePattern('proposta:lista:*');

  logger.info('Proposta aceita com sucesso', { propostaId: command.proposta_id });

  return propostaAtualizada;
}
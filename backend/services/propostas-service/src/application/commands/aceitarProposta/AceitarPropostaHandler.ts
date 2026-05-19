import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { AceitarPropostaCommand } from "./AceitarPropostaCommand";
import { Proposta } from "../../../domain/entities/Proposta";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { PropostaAceitaEvent } from "../../../infrastructure/messaging/events/PropostaAceitaEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";

const cache = new RedisCacheService();

export async function AceitarPropostaHandler(
  command: AceitarPropostaCommand
): Promise<Proposta> {
  if (!command.proposta_id) throw new Error("ID da proposta é obrigatório");

  const proposta = await PropostaRepository.findById(command.proposta_id);
  if (!proposta) throw new Error("Proposta não encontrada");

  if (proposta.status === "ACEITA") throw new Error("Proposta já foi aceita");

  // 1. Persiste no banco
  const propostaAtualizada = await PropostaRepository.updateStatus(
    command.proposta_id, "ACEITA"
  );

  // 2. Publica evento
  const evento: PropostaAceitaEvent = {
    tipo: "proposta.aceita",
    proposta_id: propostaAtualizada.id,
    status: propostaAtualizada.status,
    updated_at: propostaAtualizada.updated_at,
  };
  await publishEvent(evento);

  // 3. Invalida cache — SEMPRE após o commit no banco
  await cache.invalidate(`proposta:item:${command.proposta_id}`);
  await cache.invalidatePattern('proposta:lista:*');

  return propostaAtualizada;
}
import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { AceitarPropostaCommand } from "./AceitarPropostaCommand";
import { Proposta } from "../../../domain/entities/Proposta";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { PropostaAceitaEvent } from "../../../infrastructure/messaging/events/PropostaAceitaEvent";

export async function AceitarPropostaHandler(
  command: AceitarPropostaCommand
): Promise<Proposta> {
  if (!command.proposta_id) {
    throw new Error("ID da proposta é obrigatório");
  }

  const proposta = await PropostaRepository.findById(command.proposta_id);
  if (!proposta) {
    throw new Error("Proposta não encontrada");
  }

  if (proposta.status === "ACEITA") {
    throw new Error("Proposta já foi aceita");
  }

  // ✅ Persiste no banco antes de publicar o evento
  const propostaAtualizada = await PropostaRepository.updateStatus(
    command.proposta_id,
    "ACEITA"
  );

  const evento: PropostaAceitaEvent = {
    tipo: "proposta.aceita",
    proposta_id: propostaAtualizada.id,
    status: propostaAtualizada.status,
    updated_at: propostaAtualizada.updated_at,
  };

  await publishEvent(evento);

  return propostaAtualizada;
}
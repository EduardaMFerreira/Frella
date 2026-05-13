import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { AceitarPropostaCommand } from "./AceitarPropostaCommand";
import { Proposta } from "../../../domain/entities/Proposta";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { PropostaAceitaEvent } from "../../../infrastructure/messaging/events/PropostaAceitaEvent";

export async function AceitarPropostaHandler(
  command: AceitarPropostaCommand
): Promise<Proposta | null> {
  if (!command.proposta_id) {
    throw new Error("ID da proposta é obrigatório");
  }
  const proposta = await PropostaRepository.findById(command.proposta_id);
  if (!proposta) {
    throw new Error("Proposta não encontrada");
  }
  proposta.status = "ACEITA";

  const evento: PropostaAceitaEvent = {
    tipo: 'proposta.aceita',
    proposta_id: proposta.id,
    status: proposta.status,
    updated_at: new Date(),
  };
  await publishEvent(evento);

  return proposta;
}
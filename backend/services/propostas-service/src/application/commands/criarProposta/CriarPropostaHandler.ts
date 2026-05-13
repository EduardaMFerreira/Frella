import { PropostaRepository } from "../../../infrastructure/database/PropostaRepository";
import { validarCriarProposta } from "../../validators/CriarPropostaValidator";
import { CriarPropostaCommand } from "./CriarPropostaCommand";
import { Proposta } from "../../../domain/entities/Proposta";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { PropostaCriadaEvent } from "../../../infrastructure/messaging/events/PropostaCriadaEvent";

export class CriarPropostaHandler {
  async execute(cmd: CriarPropostaCommand): Promise<Proposta> {
    validarCriarProposta(cmd);
    const proposta = await PropostaRepository.create({
      titulo: cmd.titulo,
      descricao: cmd.descricao,
      valor: cmd.valor,
      status: "Criada",
      cliente_id: cmd.cliente_id,
      prestador_id: cmd.prestador_id
    });

    const evento: PropostaCriadaEvent = {
      tipo: 'proposta.criada',
      proposta_id: proposta.id,
      titulo: proposta.titulo,
      descricao: proposta.descricao,
      valor: proposta.valor,
      status: proposta.status,
      cliente_id: proposta.cliente_id,
      prestador_id: proposta.prestador_id,
      created_at: proposta.created_at,
    };
    await publishEvent(evento);

    return proposta;
  }
}
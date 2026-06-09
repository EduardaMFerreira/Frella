import { PropostaRepositoryResilient } from "../../../infrastructure/database/PropostaRepositoryResilient";
import { validarCriarProposta } from "../../validators/CriarPropostaValidator";
import { CriarPropostaCommand } from "./CriarPropostaCommand";
import { Proposta } from "../../../domain/entities/Proposta";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { PropostaCriadaEvent } from "../../../infrastructure/messaging/events/PropostaCriadaEvent";
import { logger } from "../../../infrastructure/logger";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";

const cache = new RedisCacheService();

export class CriarPropostaHandler {
  async execute(cmd: CriarPropostaCommand): Promise<Proposta> {
    logger.info('Iniciando criação de proposta', {
      clienteId: cmd.cliente_id,
      prestadorId: cmd.prestador_id,
      valor: cmd.valor,
    });
    validarCriarProposta(cmd);
    const proposta = await PropostaRepositoryResilient.create({
      titulo: cmd.titulo,
      descricao: cmd.descricao,
      valor: cmd.valor,
      status: "Criada",
      cliente_id: cmd.cliente_id,
      prestador_id: cmd.prestador_id,
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
    logger.info('Evento proposta.criada publicado', { propostaId: proposta.id });

    await cache.invalidatePattern('proposta:lista:*');
    logger.info('Cache invalidado após criação', { propostaId: proposta.id });

    logger.info('Proposta criada com sucesso', { propostaId: proposta.id });
    return proposta;
  }
}
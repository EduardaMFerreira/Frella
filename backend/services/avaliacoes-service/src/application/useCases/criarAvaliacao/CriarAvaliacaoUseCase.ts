import { AvaliacaoRepository } from "../../../infrastructure/database/AvaliacaoRepository";
import { CriarAvaliacaoDTO } from "./CriarAvaliacaoDTO";
import { Avaliacao } from "../../../domain/entities/Avaliacao";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { AvaliacaoCriadaEvent } from "../../../infrastructure/messaging/events/AvaliacaoCriadaEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();

export async function CriarAvaliacaoUseCase(
  data: CriarAvaliacaoDTO
): Promise<Avaliacao> {
  logger.info('Iniciando criação de avaliação', {
    clienteId: data.cliente_id,
    prestadorId: data.prestador_id,
    nota: data.nota,
  });

  if (!data.nota) {
    logger.warn('Criação de avaliação sem nota');
    throw new Error("Nota é obrigatória");
  }
  if (!data.cliente_id) {
    logger.warn('Criação de avaliação sem cliente');
    throw new Error("Cliente é obrigatório");
  }
  if (!data.prestador_id) {
    logger.warn('Criação de avaliação sem prestador');
    throw new Error("Prestador é obrigatório");
  }
  if (data.nota < 1 || data.nota > 5) {
    logger.warn('Nota fora do intervalo permitido', { nota: data.nota });
    throw new Error("Nota deve ser entre 1 e 5");
  }

  const avaliacao = await AvaliacaoRepository.create({
    nota: data.nota,
    comentario: data.comentario,
    cliente_id: data.cliente_id,
    prestador_id: data.prestador_id,
  });

  const evento: AvaliacaoCriadaEvent = {
    tipo: 'avaliacao.criada',
    avaliacao_id: avaliacao.id,
    cliente_id: avaliacao.cliente_id,
    prestador_id: avaliacao.prestador_id,
    nota: avaliacao.nota,
    comentario: avaliacao.comentario,
    created_at: avaliacao.created_at,
  };

  await publishEvent(evento);
  logger.info('Evento avaliacao.criada publicado', { avaliacaoId: avaliacao.id });

  await cache.invalidatePattern('avaliacao:lista:*');

  logger.info('Avaliação criada com sucesso', { avaliacaoId: avaliacao.id });

  return avaliacao;
}
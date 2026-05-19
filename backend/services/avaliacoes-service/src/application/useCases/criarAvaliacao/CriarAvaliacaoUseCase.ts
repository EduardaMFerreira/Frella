import { AvaliacaoRepository } from "../../../infrastructure/database/AvaliacaoRepository";
import { CriarAvaliacaoDTO } from "./CriarAvaliacaoDTO";
import { Avaliacao } from "../../../domain/entities/Avaliacao";
import { publishEvent } from "../../../infrastructure/messaging/rabbitmq/RabbitMQConnection";
import { AvaliacaoCriadaEvent } from "../../../infrastructure/messaging/events/AvaliacaoCriadaEvent";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";

const cache = new RedisCacheService();

export async function CriarAvaliacaoUseCase(
  data: CriarAvaliacaoDTO
): Promise<Avaliacao> {
  if (!data.nota) throw new Error("Nota é obrigatória");
  if (!data.cliente_id) throw new Error("Cliente é obrigatório");
  if (!data.prestador_id) throw new Error("Prestador é obrigatório");
  if (data.nota < 1 || data.nota > 5) throw new Error("Nota deve ser entre 1 e 5");

  const avaliacao = await AvaliacaoRepository.create({
    nota: data.nota,
    comentario: data.comentario,
    cliente_id: data.cliente_id,
    prestador_id: data.prestador_id,
  });

  // Publica evento
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

  // Invalida lista em cache
  await cache.invalidatePattern('avaliacao:lista:*');

  return avaliacao;
}
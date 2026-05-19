import { broadcast, } from '../../infrastructure/websocket/WebSocketServer';
import { broadcastParaSala } from '../../infrastructure/websocket/WebSocketRoomManager';
import { pool } from '../../infrastructure/database/connection';
import { PropostaReadRepository } from '../../infrastructure/database/PropostaReadRepository';
import { PropostaCriadaEvent } from '../../infrastructure/messaging/events/PropostaCriadaEvent';
import { PropostaAceitaEvent } from '../../infrastructure/messaging/events/PropostaAceitaEvent';
import { PropostaRemovidaEvent } from '../../infrastructure/messaging/events/PropostaRemovidaEvent';

type PropostaEvento = PropostaCriadaEvent | PropostaAceitaEvent | PropostaRemovidaEvent;

async function eventoJaProcessado(eventoId: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT id FROM eventos_processados WHERE id = $1',
    [eventoId]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

async function registrarEventoProcessado(eventoId: string, tipo: string): Promise<void> {
  await pool.query(
    'INSERT INTO eventos_processados (id, tipo) VALUES ($1, $2)',
    [eventoId, tipo]
  );
}

export async function PropostaProjector(
  evento: PropostaEvento,
  eventoId: string
): Promise<void> {
  console.log('[Projector] Processando evento:', evento.tipo);

  if (await eventoJaProcessado(eventoId)) {
    console.warn('[Projector] Evento já processado, ignorando:', eventoId);
    return;
  }

  if (evento.tipo === 'proposta.criada') {
    await PropostaReadRepository.upsert({
      id: evento.proposta_id,
      titulo: evento.titulo,
      descricao: evento.descricao,
      valor: evento.valor,
      status: evento.status,
      cliente_id: evento.cliente_id,
      prestador_id: evento.prestador_id,
      criada_em: evento.created_at,
      atualizada_em: evento.created_at,
    });
    broadcast({ tipo: 'proposta.criada', dados: evento });
    broadcastParaSala(`cliente:${evento.cliente_id}`, { tipo: 'proposta.criada', dados: evento });
    broadcastParaSala(`prestador:${evento.prestador_id}`, { tipo: 'proposta.criada', dados: evento });
    console.log('[Projector] Proposta criada no Read Model:', evento.proposta_id);
  }

  else if (evento.tipo === 'proposta.aceita') {
    const atual = await PropostaReadRepository.buscarPorId(evento.proposta_id);
    if (atual) {
      await PropostaReadRepository.upsert({
        ...atual,
        status: evento.status,
        atualizada_em: evento.updated_at,
      });
      broadcast({ tipo: 'proposta.aceita', dados: evento });
      broadcastParaSala(`cliente:${atual.cliente_id}`, { tipo: 'proposta.aceita', dados: evento });
      broadcastParaSala(`prestador:${atual.prestador_id}`, { tipo: 'proposta.aceita', dados: evento });
      console.log('[Projector] Proposta aceita no Read Model:', evento.proposta_id);
    }
  }

  else if (evento.tipo === 'proposta.removida') {
    await PropostaReadRepository.remover(evento.proposta_id);
    broadcast({ tipo: 'proposta.removida', dados: evento });
    console.log('[Projector] Proposta removida do Read Model:', evento.proposta_id);
  }

  await registrarEventoProcessado(eventoId, evento.tipo);
}
import { PropostaReadRepository } from '../../infrastructure/database/PropostaReadRepository';
import { PropostaCriadaEvent } from '../../infrastructure/messaging/events/PropostaCriadaEvent';
import { PropostaAceitaEvent } from '../../infrastructure/messaging/events/PropostaAceitaEvent';
import { PropostaRemovidaEvent } from '../../infrastructure/messaging/events/PropostaRemovidaEvent';

type PropostaEvento = PropostaCriadaEvent | PropostaAceitaEvent | PropostaRemovidaEvent;

export async function PropostaProjector(evento: PropostaEvento): Promise<void> {
  console.log('[Projector] Processando evento:', evento.tipo);

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
      console.log('[Projector] Proposta aceita no Read Model:', evento.proposta_id);
    }
  }

  else if (evento.tipo === 'proposta.removida') {
    await PropostaReadRepository.remover(evento.proposta_id);
    console.log('[Projector] Proposta removida do Read Model:', evento.proposta_id);
  }
}
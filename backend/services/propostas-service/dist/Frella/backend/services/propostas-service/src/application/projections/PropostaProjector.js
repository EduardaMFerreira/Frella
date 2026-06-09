"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropostaProjector = PropostaProjector;
const WebSocketServer_1 = require("../../infrastructure/websocket/WebSocketServer");
const WebSocketRoomManager_1 = require("../../infrastructure/websocket/WebSocketRoomManager");
const connection_1 = require("../../infrastructure/database/connection");
const PropostaReadRepository_1 = require("../../infrastructure/database/PropostaReadRepository");
async function eventoJaProcessado(eventoId) {
    const result = await connection_1.pool.query('SELECT id FROM eventos_processados WHERE id = $1', [eventoId]);
    return result.rowCount !== null && result.rowCount > 0;
}
async function registrarEventoProcessado(eventoId, tipo) {
    await connection_1.pool.query('INSERT INTO eventos_processados (id, tipo) VALUES ($1, $2)', [eventoId, tipo]);
}
async function PropostaProjector(evento, eventoId) {
    console.log('[Projector] Processando evento:', evento.tipo);
    if (await eventoJaProcessado(eventoId)) {
        console.warn('[Projector] Evento já processado, ignorando:', eventoId);
        return;
    }
    if (evento.tipo === 'proposta.criada') {
        await PropostaReadRepository_1.PropostaReadRepository.upsert({
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
        (0, WebSocketServer_1.broadcast)({ tipo: 'proposta.criada', dados: evento });
        (0, WebSocketRoomManager_1.broadcastParaSala)(`cliente:${evento.cliente_id}`, { tipo: 'proposta.criada', dados: evento });
        (0, WebSocketRoomManager_1.broadcastParaSala)(`prestador:${evento.prestador_id}`, { tipo: 'proposta.criada', dados: evento });
        console.log('[Projector] Proposta criada no Read Model:', evento.proposta_id);
    }
    else if (evento.tipo === 'proposta.aceita') {
        const atual = await PropostaReadRepository_1.PropostaReadRepository.buscarPorId(evento.proposta_id);
        if (atual) {
            await PropostaReadRepository_1.PropostaReadRepository.upsert({
                ...atual,
                status: evento.status,
                atualizada_em: evento.updated_at,
            });
            (0, WebSocketServer_1.broadcast)({ tipo: 'proposta.aceita', dados: evento });
            (0, WebSocketRoomManager_1.broadcastParaSala)(`cliente:${atual.cliente_id}`, { tipo: 'proposta.aceita', dados: evento });
            (0, WebSocketRoomManager_1.broadcastParaSala)(`prestador:${atual.prestador_id}`, { tipo: 'proposta.aceita', dados: evento });
            console.log('[Projector] Proposta aceita no Read Model:', evento.proposta_id);
        }
    }
    else if (evento.tipo === 'proposta.removida') {
        await PropostaReadRepository_1.PropostaReadRepository.remover(evento.proposta_id);
        (0, WebSocketServer_1.broadcast)({ tipo: 'proposta.removida', dados: evento });
        console.log('[Projector] Proposta removida do Read Model:', evento.proposta_id);
    }
    await registrarEventoProcessado(eventoId, evento.tipo);
}

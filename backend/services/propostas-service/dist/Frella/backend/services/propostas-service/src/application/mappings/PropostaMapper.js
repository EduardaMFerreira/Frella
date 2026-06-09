"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPropostaDto = toPropostaDto;
function toPropostaDto(p) {
    return {
        id: p.id,
        titulo: p.titulo,
        descricao: p.descricao,
        valor: p.valor,
        status: p.status
    };
}

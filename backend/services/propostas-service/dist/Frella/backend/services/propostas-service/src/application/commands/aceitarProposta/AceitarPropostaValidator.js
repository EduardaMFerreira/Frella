"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarAceitarProposta = validarAceitarProposta;
function validarAceitarProposta(data) {
    if (!data.id || !data.id.trim()) {
        throw new Error("ID da proposta é obrigatório");
    }
    if (!data.prestador_id || !data.prestador_id.trim()) {
        throw new Error("Prestador é obrigatório");
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarRemoverProposta = validarRemoverProposta;
function validarRemoverProposta(data) {
    if (!data.id || !data.id.trim()) {
        throw new Error("ID da proposta é obrigatório");
    }
}

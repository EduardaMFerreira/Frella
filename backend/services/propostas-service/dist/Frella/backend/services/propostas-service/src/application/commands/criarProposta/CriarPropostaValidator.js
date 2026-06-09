"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCriarProposta = validarCriarProposta;
function validarCriarProposta(data) {
    if (!data.titulo || !data.titulo.trim()) {
        throw new Error("Título é obrigatório");
    }
    if (!data.descricao || !data.descricao.trim()) {
        throw new Error("Descrição é obrigatória");
    }
    if (data.valor == null || data.valor <= 0) {
        throw new Error("Valor deve ser maior que zero");
    }
    if (!data.cliente_id || !data.cliente_id.trim()) {
        throw new Error("Cliente é obrigatório");
    }
    if (!data.prestador_id || !data.prestador_id.trim()) {
        throw new Error("Prestador é obrigatório");
    }
}

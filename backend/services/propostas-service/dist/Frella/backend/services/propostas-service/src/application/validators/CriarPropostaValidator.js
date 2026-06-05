"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCriarProposta = validarCriarProposta;
function validarCriarProposta(data) {
    if (!data.titulo)
        throw new Error("Título obrigatório");
    if (!data.descricao)
        throw new Error("Descrição obrigatória");
    if (data.valor <= 0)
        throw new Error("Valor inválido");
    if (!data.cliente_id)
        throw new Error("Cliente obrigatório");
    if (!data.prestador_id)
        throw new Error("Prestador obrigatório");
}

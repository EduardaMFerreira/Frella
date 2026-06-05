"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Especialidade = void 0;
class Especialidade {
    constructor(valor) {
        this.valor = valor;
    }
    static create(valor) {
        if (!valor?.trim())
            throw new Error("Especialidade não pode ser vazia");
        if (valor.trim().length < 3)
            throw new Error("Especialidade deve ter pelo menos 3 caracteres");
        return new Especialidade(valor.trim());
    }
    toString() {
        return this.valor;
    }
}
exports.Especialidade = Especialidade;

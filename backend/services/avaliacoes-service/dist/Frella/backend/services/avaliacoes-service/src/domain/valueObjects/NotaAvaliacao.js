"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotaAvaliacao = void 0;
class NotaAvaliacao {
    constructor(value) {
        this.value = value;
    }
    static create(nota) {
        if (nota < 1 || nota > 5) {
            throw new Error("Nota deve ser entre 1 e 5");
        }
        return new NotaAvaliacao(nota);
    }
    getValue() {
        return this.value;
    }
}
exports.NotaAvaliacao = NotaAvaliacao;

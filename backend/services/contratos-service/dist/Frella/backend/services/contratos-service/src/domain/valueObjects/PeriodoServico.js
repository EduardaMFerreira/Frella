"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodoServico = void 0;
class PeriodoServico {
    constructor(dataInicio, dataFim) {
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }
    static create(dataInicio, dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        if (isNaN(inicio.getTime()))
            throw new Error("Data de início inválida");
        if (isNaN(fim.getTime()))
            throw new Error("Data de fim inválida");
        if (fim <= inicio)
            throw new Error("Data de fim deve ser posterior à data de início");
        return new PeriodoServico(inicio, fim);
    }
    getDataInicio() {
        return this.dataInicio;
    }
    getDataFim() {
        return this.dataFim;
    }
    toJSON() {
        return {
            data_inicio: this.dataInicio,
            data_fim: this.dataFim,
        };
    }
}
exports.PeriodoServico = PeriodoServico;

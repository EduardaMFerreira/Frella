export class PeriodoServico {
  private constructor(
    private readonly dataInicio: Date,
    private readonly dataFim: Date
  ) {}

  static create(dataInicio: Date | string, dataFim: Date | string): PeriodoServico {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (isNaN(inicio.getTime())) throw new Error("Data de início inválida");
    if (isNaN(fim.getTime())) throw new Error("Data de fim inválida");
    if (fim <= inicio) throw new Error("Data de fim deve ser posterior à data de início");

    return new PeriodoServico(inicio, fim);
  }

  getDataInicio(): Date {
    return this.dataInicio;
  }

  getDataFim(): Date {
    return this.dataFim;
  }

  toJSON() {
    return {
      data_inicio: this.dataInicio,
      data_fim: this.dataFim,
    };
  }
}
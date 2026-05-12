export class NotaAvaliacao {

  private constructor(
    private readonly value: number
  ) {}

  static create(nota: number): NotaAvaliacao {

    if (nota < 1 || nota > 5) {
      throw new Error(
        "Nota deve ser entre 1 e 5"
      );
    }

    return new NotaAvaliacao(nota);
  }

  getValue(): number {
    return this.value;
  }
}
export class Especialidade {
  private constructor(private readonly valor: string) {}

  static create(valor: string): Especialidade {
    if (!valor?.trim()) throw new Error("Especialidade não pode ser vazia");
    if (valor.trim().length < 3)
      throw new Error("Especialidade deve ter pelo menos 3 caracteres");

    return new Especialidade(valor.trim());
  }

  toString(): string {
    return this.valor;
  }
}
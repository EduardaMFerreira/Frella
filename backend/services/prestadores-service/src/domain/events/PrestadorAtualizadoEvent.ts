export class PrestadorAtualizadoEvent {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly email: string
  ) {}
}
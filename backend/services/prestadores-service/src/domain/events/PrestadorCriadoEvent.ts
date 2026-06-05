export class PrestadorCriadoEvent {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly email: string
  ) {}
}
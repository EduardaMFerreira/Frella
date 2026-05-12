export interface EnderecoProps {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export class Endereco {
  private constructor(private readonly props: EnderecoProps) {}

  static create(props: EnderecoProps): Endereco {
    if (!props.logradouro?.trim()) throw new Error("Logradouro é obrigatório");
    if (!props.numero?.trim()) throw new Error("Número é obrigatório");
    if (!props.bairro?.trim()) throw new Error("Bairro é obrigatório");
    if (!props.cidade?.trim()) throw new Error("Cidade é obrigatória");
    if (!props.estado?.trim() || props.estado.length !== 2)
      throw new Error("Estado deve ser a sigla com 2 letras (ex: SP)");
    if (!props.cep?.trim() || !/^\d{5}-?\d{3}$/.test(props.cep))
      throw new Error("CEP inválido (formato: 00000-000)");

    return new Endereco({
      ...props,
      cep: props.cep.replace("-", ""),
      estado: props.estado.toUpperCase(),
    });
  }

  toJSON(): EnderecoProps {
    return { ...this.props };
  }
}
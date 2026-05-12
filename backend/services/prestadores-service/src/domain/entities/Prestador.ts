export interface Prestador {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  especialidades: string[];
  descricao?: string;
  valor_hora?: number;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  created_at: Date;
  updated_at: Date;
}
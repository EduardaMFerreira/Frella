export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
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
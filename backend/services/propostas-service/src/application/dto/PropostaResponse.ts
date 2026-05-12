export interface PropostaResponse {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  status: string;
  cliente_id: string;
  prestador_id: string;
  created_at: Date;
  updated_at: Date;
}
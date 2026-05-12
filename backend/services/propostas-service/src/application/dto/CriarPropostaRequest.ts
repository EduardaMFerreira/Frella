export interface CriarPropostaRequest {
  titulo: string;
  descricao: string;
  valor: number;
  cliente_id: string;
  prestador_id: string;
}
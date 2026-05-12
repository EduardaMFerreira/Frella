export interface Proposta {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  status: "PENDENTE" | "ACEITA" | "RECUSADA";
  cliente_id: string;
  prestador_id: string;
  created_at: Date;
  updated_at: Date;
}
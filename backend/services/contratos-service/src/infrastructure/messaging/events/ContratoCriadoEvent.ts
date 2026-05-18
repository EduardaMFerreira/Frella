export interface ContratoCriadoEvent {
  tipo: 'contrato.criado';
  contrato_id: string;
  cliente_id: string;
  prestador_id: string;
  descricao: string;
  valor: number;
  data_inicio: Date;
  data_fim: Date;
  status: string;
  created_at: Date;
}
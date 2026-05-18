export interface AvaliacaoCriadaEvent {
  tipo: 'avaliacao.criada';
  avaliacao_id: string;
  cliente_id: string;
  prestador_id: string;
  nota: number;
  comentario?: string;
  created_at: Date;
}
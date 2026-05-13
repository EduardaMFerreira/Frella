export interface PropostaAceitaEvent {
  tipo: 'proposta.aceita';
  proposta_id: string;
  status: string;
  updated_at: Date;
}

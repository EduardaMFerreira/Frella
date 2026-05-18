export interface ServicoFinalizadoEvent {
  tipo: 'servico.finalizado';
  contrato_id: string;
  cliente_id: string;
  prestador_id: string;
  status: string;
  updated_at: Date;
}
export interface PropostaReadModel {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  status: string;
  cliente_id: string;
  prestador_id: string;
  criada_em: Date;
  atualizada_em: Date;
}
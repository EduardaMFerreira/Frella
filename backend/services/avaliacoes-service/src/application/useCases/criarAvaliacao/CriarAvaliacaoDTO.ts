export interface CriarAvaliacaoDTO {
  nota: number;
  comentario?: string;
  cliente_id: string;
  prestador_id: string;
}
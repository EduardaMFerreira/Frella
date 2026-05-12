import { StatusContrato } from "../enums/StatusContrato";

export interface Contrato {
  id: string;
  cliente_id: string;
  prestador_id: string;
  descricao: string;
  valor: number;
  data_inicio: Date;
  data_fim: Date;
  status: StatusContrato;
  created_at: Date;
  updated_at: Date;
}
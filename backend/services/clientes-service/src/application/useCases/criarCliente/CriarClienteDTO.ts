import { EnderecoProps } from "../../../domain/valueObjects/Endereco";

export interface CriarClienteDTO {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: EnderecoProps;
}
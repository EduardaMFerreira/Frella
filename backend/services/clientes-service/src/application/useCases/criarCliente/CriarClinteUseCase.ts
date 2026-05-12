import { ClienteRepository } from "../../../infrastructure/database/ClienteRepository";
import { Endereco } from "../../../domain/valueObjects/Endereco";
import { CriarClienteDTO } from "./CriarClienteDTO";
import { Cliente } from "../../../domain/entities/Cliente";

export async function CriarClienteUseCase(data: CriarClienteDTO): Promise<Cliente> {
  if (!data.nome?.trim()) throw new Error("Nome é obrigatório");
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    throw new Error("E-mail inválido");

  const existente = await ClienteRepository.findByEmail(data.email);
  if (existente) throw new Error("E-mail já cadastrado");

  let endereco = undefined;
  if (data.endereco) {
    endereco = Endereco.create(data.endereco).toJSON();
  }

  return ClienteRepository.create({
    nome: data.nome.trim(),
    email: data.email.trim().toLowerCase(),
    telefone: data.telefone?.trim(),
    endereco,
  });
}
import { ClienteRepository } from "../../../infrastructure/database/ClienteRepository";
import { Endereco } from "../../../domain/valueObjects/Endereco";
import { CriarClienteDTO } from "./CriarClienteDTO";
import { Cliente } from "../../../domain/entities/Cliente";
import { RedisCacheService } from "../../../infrastructure/cache/RadisCacheService";
import { logger } from "../../../infrastructure/logger";

const cache = new RedisCacheService();

export async function CriarClienteUseCase(data: CriarClienteDTO): Promise<Cliente> {
  logger.info('Iniciando criação de cliente', { email: data.email });

  if (!data.nome?.trim()) {
    logger.warn('Tentativa de criação sem nome');
    throw new Error("Nome é obrigatório");
  }

  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    logger.warn('Tentativa de criação com e-mail inválido', { email: data.email });
    throw new Error("E-mail inválido");
  }

  const existente = await ClienteRepository.findByEmail(data.email);
  if (existente) {
    logger.warn('Tentativa de cadastro com e-mail já existente', { email: data.email });
    throw new Error("E-mail já cadastrado");
  }

  let endereco = undefined;
  if (data.endereco) {
    endereco = Endereco.create(data.endereco).toJSON();
  }

  const cliente = await ClienteRepository.create({
    nome: data.nome.trim(),
    email: data.email.trim().toLowerCase(),
    telefone: data.telefone?.trim(),
    endereco,
  });

  await cache.invalidatePattern('cliente:lista:*');

  logger.info('Cliente criado com sucesso', { clienteId: cliente.id });

  return cliente;
}
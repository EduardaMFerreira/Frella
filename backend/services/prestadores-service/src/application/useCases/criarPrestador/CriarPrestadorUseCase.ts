import { PrestadorRepository } from "../../../infrastructure/database/PrestadorRepository";
import { Especialidade } from "../../../domain/valueObjects/Especialidade";
import { Prestador } from "../../../domain/entities/Prestador";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";
import { logger } from "../../../infrastructure/logger";
import { RabbitMQConnection } from "../../../infrastructure/messaging/RabbitMQConnection";
import { PrestadorCriadoEvent } from "../../../domain/events/PrestadorCriadoEvent";

const cache = new RedisCacheService();

export interface CriarPrestadorDTO {
  nome: string;
  email: string;
  telefone?: string;
  especialidades: string[];
  descricao?: string;
  valor_hora?: number;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export async function CriarPrestadorUseCase(
  data: CriarPrestadorDTO
): Promise<Prestador> {
  logger.info('Iniciando criação de prestador', { email: data.email });

  if (!data.nome?.trim()) {
    logger.warn('Criação de prestador sem nome');
    throw new Error("Nome é obrigatório");
  }
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    logger.warn('Criação de prestador com e-mail inválido', { email: data.email });
    throw new Error("E-mail inválido");
  }
  if (!data.especialidades?.length) {
    logger.warn('Criação de prestador sem especialidades');
    throw new Error("Informe pelo menos uma especialidade");
  }

  const existente = await PrestadorRepository.findByEmail(data.email);
  if (existente) {
    logger.warn('Tentativa de cadastro com e-mail já existente', { email: data.email });
    throw new Error("E-mail já cadastrado");
  }

  data.especialidades.map((e) => Especialidade.create(e).toString());

  const prestador = await PrestadorRepository.create({
    nome: data.nome.trim(),
    email: data.email.trim().toLowerCase(),
    telefone: data.telefone?.trim(),
    especialidades: data.especialidades,
    descricao: data.descricao?.trim(),
    valor_hora: data.valor_hora,
    endereco: data.endereco,
  });

  const evento = new PrestadorCriadoEvent(
    prestador.id,
    prestador.nome,
    prestador.email
  );

  await RabbitMQConnection.publish(
    "prestador.criado",
    evento
  );

  await cache.invalidatePattern('prestador:lista:*');

  logger.info('Prestador criado com sucesso', {
    prestadorId: prestador.id,
    especialidades: data.especialidades,
  });

  return prestador;
}
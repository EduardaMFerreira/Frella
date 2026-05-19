import { PrestadorRepository } from "../../../infrastructure/database/PrestadorRepository";
import { Especialidade } from "../../../domain/valueObjects/Especialidade";
import { Prestador } from "../../../domain/entities/Prestador";
import { RedisCacheService } from "../../../infrastructure/cache/RedisCacheService";

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
  if (!data.nome?.trim()) throw new Error("Nome é obrigatório");
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    throw new Error("E-mail inválido");
  if (!data.especialidades?.length)
    throw new Error("Informe pelo menos uma especialidade");

  const existente = await PrestadorRepository.findByEmail(data.email);
  if (existente) throw new Error("E-mail já cadastrado");

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

  // Invalida lista em cache pois novo prestador foi criado
  await cache.invalidatePattern('prestador:lista:*');

  return prestador;
}
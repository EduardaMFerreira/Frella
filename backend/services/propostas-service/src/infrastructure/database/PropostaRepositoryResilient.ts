import { resilientPolicy } from '../resilience/ResiliencePolicy';
import { PropostaRepository } from './PropostaRepository';
import { Proposta } from '../../domain/entities/Proposta';

export const PropostaRepositoryResilient = {

  async findAll(): Promise<Proposta[]> {
    return resilientPolicy.execute(() => PropostaRepository.findAll());
  },

  async findById(id: string): Promise<Proposta | null> {
    return resilientPolicy.execute(() => PropostaRepository.findById(id));
  },

  async create(data: {
    titulo: string;
    descricao: string;
    valor: number;
    status: string;
    cliente_id: string;
    prestador_id: string;
  }): Promise<Proposta> {
    return resilientPolicy.execute(() => PropostaRepository.create(data));
  },

  async updateStatus(id: string, status: string): Promise<Proposta> {
    return resilientPolicy.execute(() => PropostaRepository.updateStatus(id, status));
  },

  async remove(id: string): Promise<void> {
    return resilientPolicy.execute(() => PropostaRepository.remove(id));
  },
};
import { PropostaRepository } from "../infrastructure/database/PropostaRepository";

jest.mock("../infrastructure/database/PropostaRepository");
jest.mock("../infrastructure/messaging/rabbitmq/RabbitMQConnection", () => ({
  publishEvent: jest.fn().mockResolvedValue(undefined),
  getRabbitMQChannel: jest.fn().mockResolvedValue({}),
}));

const mockProposta = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  titulo: "Reforma banheiro",
  descricao: "Desenvolvimento de sistema",
  valor: 3500,
  status: "CRIADA",
  cliente_id: "456e4567-e89b-12d3-a456-426614174001",
  prestador_id: "789e4567-e89b-12d3-a456-426614174002",
  criada_em: new Date(),
  atualizada_em: new Date(),
};

describe("PropostaRepository", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar uma proposta e retornar os dados", async () => {
    (PropostaRepository.create as jest.Mock)
      .mockResolvedValue(mockProposta);

    const resultado = await PropostaRepository.create({
      titulo: "Reforma banheiro",
      descricao: "Desenvolvimento de sistema",
      valor: 3500,
      status: "CRIADA",
      cliente_id: "456e4567-e89b-12d3-a456-426614174001",
      prestador_id: "789e4567-e89b-12d3-a456-426614174002",
    });

    expect(resultado.titulo).toBe("Reforma banheiro");
    expect(resultado.status).toBe("CRIADA");
    expect(PropostaRepository.create).toHaveBeenCalledTimes(1);
  });

  it("deve buscar todas as propostas", async () => {
    (PropostaRepository.findAll as jest.Mock)
      .mockResolvedValue([mockProposta]);

    const resultado = await PropostaRepository.findAll();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(mockProposta.id);
  });

});
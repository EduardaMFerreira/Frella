import request from "supertest";
import app from "../app";
import { PropostaRepository } from "../infrastructure/database/PropostaRepository";
import { PropostaReadRepository } from "../infrastructure/database/PropostaReadRepository";

jest.mock('../infrastructure/resilience/ResiliencePolicy', () => ({
  resilientPolicy: {
    execute: jest.fn((fn: () => Promise<any>) => fn()),
  },
}));

jest.mock("../infrastructure/messaging/rabbitmq/RabbitMQConnection", () => ({
  publishEvent: jest.fn().mockResolvedValue(undefined),
  getRabbitMQChannel: jest.fn().mockResolvedValue({}),
}));

jest.mock("../infrastructure/database/PropostaRepository", () => ({
  PropostaRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock("../infrastructure/database/PropostaReadRepository", () => ({
  PropostaReadRepository: {
    listarTodas: jest.fn(),
    buscarPorId: jest.fn(),
  },
}));

jest.mock('../infrastructure/cache/RedisCacheService', () => ({
  RedisCacheService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
  })),
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

describe("Propostas Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET deve retornar 200", async () => {
    (PropostaReadRepository.listarTodas as jest.Mock)
      .mockResolvedValue([mockProposta]);

    const res = await request(app).get("/api/propostas");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("POST deve retornar 400 sem dados", async () => {
    const res = await request(app)
      .post("/api/propostas")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST deve retornar 201 com dados válidos", async () => {
    (PropostaRepository.create as jest.Mock)
      .mockResolvedValue(mockProposta);

    const res = await request(app)
      .post("/api/propostas")
      .send({
        titulo: "Reforma banheiro",
        descricao: "Desenvolvimento de sistema",
        valor: 3500,
        cliente_id: "456e4567-e89b-12d3-a456-426614174001",
        prestador_id: "789e4567-e89b-12d3-a456-426614174002",
      });

    expect(res.status).toBe(201);
  });
});
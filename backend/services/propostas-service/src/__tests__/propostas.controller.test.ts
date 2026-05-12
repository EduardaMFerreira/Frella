import request from "supertest";
import app from "../app";
import { PropostaRepository } from "../infrastructure/database/PropostaRepository";

jest.mock("../infrastructure/database/PropostaRepository");

const mockProposta = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  cliente_id: "456e4567-e89b-12d3-a456-426614174001",
  prestador_id: "789e4567-e89b-12d3-a456-426614174002",
  descricao: "Desenvolvimento de sistema",
  valor: 3500,
  status: "PENDENTE",
  created_at: new Date(),
  updated_at: new Date(),
};

describe("Propostas Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET deve retornar 200", async () => {
    (PropostaRepository.findAll as jest.Mock).mockResolvedValue([
      mockProposta,
    ]);

    const res = await request(app).get("/api/propostas");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("POST deve retornar 400 sem dados", async () => {
    const res = await request(app).post("/api/propostas").send({});

    expect(res.status).toBe(400);
  });

  it("POST deve retornar 201 com dados válidos", async () => {
    (PropostaRepository.create as jest.Mock).mockResolvedValue(mockProposta);

    const res = await request(app)
      .post("/api/propostas")
      .send({
        cliente_id: "456e4567-e89b-12d3-a456-426614174001",
        prestador_id: "789e4567-e89b-12d3-a456-426614174002",
        descricao: "Desenvolvimento de sistema",
        valor: 3500,
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("PENDENTE");
  });
});
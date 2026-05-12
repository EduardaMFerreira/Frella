import request from "supertest";
import app from "../app";

import { AvaliacaoRepository } from "../infrastructure/database/AvaliacaoRepository";

jest.mock("../infrastructure/database/AvaliacaoRepository");

const mockAvaliacao = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  nota: 5,
  comentario: "Excelente atendimento",
  cliente_id: "456e4567-e89b-12d3-a456-426614174001",
  prestador_id: "789e4567-e89b-12d3-a456-426614174002",
  created_at: new Date(),
  updated_at: new Date(),
};

describe("Avaliacao Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET deve retornar 200", async () => {

    (AvaliacaoRepository.findAll as jest.Mock)
      .mockResolvedValue([mockAvaliacao]);

    const res = await request(app)
      .get("/api/avaliacoes");

    expect(res.status).toBe(200);

    expect(res.body).toHaveLength(1);

  });

  it("POST deve retornar 400 sem dados", async () => {

    const res = await request(app)
      .post("/api/avaliacoes")
      .send({});

    expect(res.status).toBe(400);

  });

  it("POST deve retornar 201 com dados válidos", async () => {

    (AvaliacaoRepository.create as jest.Mock)
      .mockResolvedValue(mockAvaliacao);

    const res = await request(app)
      .post("/api/avaliacoes")
      .send({
        nota: 5,
        comentario: "Excelente atendimento",
        cliente_id: "456e4567-e89b-12d3-a456-426614174001",
        prestador_id: "789e4567-e89b-12d3-a456-426614174002",
      });

    expect(res.status).toBe(201);

    expect(res.body.nota).toBe(5);

  });

});
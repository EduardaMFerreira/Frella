import request from "supertest";
import app from "../app";
import { ContratoRepository } from "../infrastructure/database/ContratoRepository";

jest.mock("../infrastructure/database/ContratoRepository");

const mockContrato = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  cliente_id: "456e4567-e89b-12d3-a456-426614174001",
  prestador_id: "789e4567-e89b-12d3-a456-426614174002",
  descricao: "Desenvolvimento de sistema",
  valor: 5000,
  data_inicio: new Date("2026-06-01"),
  data_fim: new Date("2026-12-01"),
  status: "PENDENTE",
  created_at: new Date(),
  updated_at: new Date(),
};

describe("Contratos Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET deve retornar 200", async () => {
    (ContratoRepository.findAll as jest.Mock).mockResolvedValue([mockContrato]);

    const res = await request(app).get("/api/contratos");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("POST deve retornar 400 sem dados", async () => {
    const res = await request(app)
      .post("/api/contratos")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST deve retornar 201 com dados válidos", async () => {
    (ContratoRepository.create as jest.Mock).mockResolvedValue(mockContrato);

    const res = await request(app)
      .post("/api/contratos")
      .send({
        cliente_id: "456e4567-e89b-12d3-a456-426614174001",
        prestador_id: "789e4567-e89b-12d3-a456-426614174002",
        descricao: "Desenvolvimento de sistema",
        valor: 5000,
        data_inicio: "2026-06-01",
        data_fim: "2026-12-01",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("PENDENTE");
  });

});
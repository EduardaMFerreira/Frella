import request from "supertest";
import app from "../app";
import { PrestadorRepository } from "../infrastructure/database/PrestadorRepository";

jest.mock("../infrastructure/database/PrestadorRepository");

const mockPrestador = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  nome: "João Silva",
  email: "joao@email.com",
  telefone: null,
  especialidades: ["Programação"],
  descricao: null,
  valor_hora: null,
  endereco: null,
  created_at: new Date(),
  updated_at: new Date(),
};

describe("Prestadores Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/prestadores deve retornar 200", async () => {
    (PrestadorRepository.findAll as jest.Mock).mockResolvedValue([mockPrestador]);

    const res = await request(app).get("/api/prestadores");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("POST /api/prestadores deve retornar 400 sem dados", async () => {
    const res = await request(app)
      .post("/api/prestadores")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/prestadores deve retornar 201 com dados válidos", async () => {
    (PrestadorRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (PrestadorRepository.create as jest.Mock).mockResolvedValue(mockPrestador);

    const res = await request(app)
      .post("/api/prestadores")
      .send({ nome: "João Silva", email: "joao@email.com", especialidades: ["Programação"] });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("joao@email.com");
  });

});
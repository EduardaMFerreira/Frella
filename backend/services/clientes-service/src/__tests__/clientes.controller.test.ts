import request from "supertest";
import app from "../app";
import { ClienteRepository } from "../infrastructure/database/ClienteRepository";

jest.mock("../infrastructure/database/ClienteRepository");

const mockCliente = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  nome: "Nana",
  email: "nana@email.com",
  telefone: null,
  endereco: null,
  created_at: new Date(),
  updated_at: new Date(),
};

describe("Clientes Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/clientes deve retornar 200", async () => {
    (ClienteRepository.findAll as jest.Mock).mockResolvedValue([mockCliente]);

    const res = await request(app).get("/api/clientes");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("POST /api/clientes deve retornar 201 com dados válidos", async () => {
    (ClienteRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (ClienteRepository.create as jest.Mock).mockResolvedValue(mockCliente);

    const res = await request(app)
      .post("/api/clientes")
      .send({ nome: "Nana", email: "nana@email.com" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("nana@email.com");
  });

  it("POST /api/clientes deve retornar 400 sem email", async () => {
    const res = await request(app)
      .post("/api/clientes")
      .send({ nome: "Nana" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("E-mail inválido");
  });

});
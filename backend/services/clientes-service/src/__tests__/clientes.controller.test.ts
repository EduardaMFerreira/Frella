import request from "supertest";
import app from "../app";

describe("Clientes Controller", () => {

  it("GET /api/clientes deve retornar 200", async () => {
    const res = await request(app).get("/api/clientes");
    expect(res.status).toBe(200);
  });

  it("POST /api/clientes deve retornar 400 sem dados", async () => {
    const res = await request(app)
      .post("/api/clientes")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/clientes deve retornar 201 com dados", async () => {
    const res = await request(app)
      .post("/api/clientes")
      .send({ nome: "Nana" });

    expect(res.status).toBe(201);
  });

});
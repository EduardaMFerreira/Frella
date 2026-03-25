import request from "supertest";
import app from "../app";

describe("Prestadores Controller", () => {

  it("GET /api/prestadores deve retornar 200", async () => {
    const res = await request(app).get("/api/prestadores");
    expect(res.status).toBe(200);
  });

  it("POST /api/prestadores deve retornar 400 sem dados", async () => {
    const res = await request(app)
      .post("/api/prestadores")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/prestadores deve retornar 201 com dados", async () => {
    const res = await request(app)
      .post("/api/prestadores")
      .send({ nome: "João" });

    expect(res.status).toBe(201);
  });

});
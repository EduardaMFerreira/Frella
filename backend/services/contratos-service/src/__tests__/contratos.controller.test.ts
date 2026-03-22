import request from "supertest";
import app from "../app";

describe("Contratos Controller", () => {

  it("GET deve retornar 200", async () => {
    const res = await request(app).get("/api/contratos");
    expect(res.status).toBe(200);
  });

  it("POST deve retornar 400 sem titulo", async () => {
    const res = await request(app)
      .post("/api/contratos")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST deve retornar 201 com titulo", async () => {
    const res = await request(app)
      .post("/api/contratos")
      .send({ titulo: "Contrato X" });

    expect(res.status).toBe(201);
  });

});
import request from "supertest";
import app from "../app";

describe("Avaliacao Controller", () => {

  it("GET /api/avaliacoes deve retornar 200", async () => {
    const res = await request(app).get("/api/avaliacoes");
    expect(res.status).toBe(200);
  });

  it("POST /api/avaliacoes deve retornar 400 sem nota", async () => {
    const res = await request(app)
      .post("/api/avaliacoes")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/avaliacoes deve retornar 201 com nota", async () => {
    const res = await request(app)
      .post("/api/avaliacoes")
      .send({ nota: 5 });

    expect(res.status).toBe(201);
  });

});
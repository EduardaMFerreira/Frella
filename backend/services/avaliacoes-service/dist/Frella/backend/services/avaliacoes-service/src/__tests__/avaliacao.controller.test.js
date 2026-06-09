"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const AvaliacaoRepository_1 = require("../infrastructure/database/AvaliacaoRepository");
jest.mock("../infrastructure/messaging/rabbitmq/RabbitMQConnection", () => ({
    publishEvent: jest.fn().mockResolvedValue(undefined),
    getRabbitMQChannel: jest.fn().mockResolvedValue({}),
}));
jest.mock("../infrastructure/database/AvaliacaoRepository");
jest.mock('../infrastructure/cache/RedisCacheService', () => ({
    RedisCacheService: jest.fn().mockImplementation(() => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        invalidate: jest.fn().mockResolvedValue(undefined),
        invalidatePattern: jest.fn().mockResolvedValue(undefined),
    })),
}));
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
        AvaliacaoRepository_1.AvaliacaoRepository.findAll
            .mockResolvedValue([mockAvaliacao]);
        const res = await (0, supertest_1.default)(app_1.default).get("/api/avaliacoes");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
    it("POST deve retornar 400 sem dados", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/avaliacoes")
            .send({});
        expect(res.status).toBe(400);
    });
    it("POST deve retornar 201 com dados válidos", async () => {
        AvaliacaoRepository_1.AvaliacaoRepository.create
            .mockResolvedValue(mockAvaliacao);
        const res = await (0, supertest_1.default)(app_1.default)
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

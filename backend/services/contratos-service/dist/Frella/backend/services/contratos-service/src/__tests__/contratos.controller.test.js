"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const ContratoRepository_1 = require("../infrastructure/database/ContratoRepository");
jest.mock("../infrastructure/messaging/rabbitmq/RabbitMQConnection", () => ({
    publishEvent: jest.fn().mockResolvedValue(undefined),
    getRabbitMQChannel: jest.fn().mockResolvedValue({}),
}));
jest.mock("../infrastructure/database/ContratoRepository");
jest.mock('../infrastructure/cache/RedisCacheService', () => ({
    RedisCacheService: jest.fn().mockImplementation(() => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        invalidate: jest.fn().mockResolvedValue(undefined),
        invalidatePattern: jest.fn().mockResolvedValue(undefined),
    })),
}));
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
        ContratoRepository_1.ContratoRepository.findAll.mockResolvedValue([mockContrato]);
        const res = await (0, supertest_1.default)(app_1.default).get("/api/contratos");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
    it("POST deve retornar 400 sem dados", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/contratos")
            .send({});
        expect(res.status).toBe(400);
    });
    it("POST deve retornar 201 com dados válidos", async () => {
        ContratoRepository_1.ContratoRepository.create.mockResolvedValue(mockContrato);
        const res = await (0, supertest_1.default)(app_1.default)
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

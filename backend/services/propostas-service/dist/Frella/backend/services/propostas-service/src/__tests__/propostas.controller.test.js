"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const PropostaRepository_1 = require("../infrastructure/database/PropostaRepository");
const PropostaReadRepository_1 = require("../infrastructure/database/PropostaReadRepository");
jest.mock("../infrastructure/messaging/rabbitmq/RabbitMQConnection", () => ({
    publishEvent: jest.fn().mockResolvedValue(undefined),
    getRabbitMQChannel: jest.fn().mockResolvedValue({}),
}));
jest.mock("../infrastructure/database/PropostaRepository");
jest.mock("../infrastructure/database/PropostaReadRepository");
jest.mock('../infrastructure/cache/RedisCacheService', () => ({
    RedisCacheService: jest.fn().mockImplementation(() => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        invalidate: jest.fn().mockResolvedValue(undefined),
        invalidatePattern: jest.fn().mockResolvedValue(undefined),
    })),
}));
const mockProposta = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    titulo: "Reforma banheiro",
    descricao: "Desenvolvimento de sistema",
    valor: 3500,
    status: "CRIADA",
    cliente_id: "456e4567-e89b-12d3-a456-426614174001",
    prestador_id: "789e4567-e89b-12d3-a456-426614174002",
    criada_em: new Date(),
    atualizada_em: new Date(),
};
describe("Propostas Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("GET deve retornar 200", async () => {
        PropostaReadRepository_1.PropostaReadRepository.listarTodas
            .mockResolvedValue([mockProposta]);
        const res = await (0, supertest_1.default)(app_1.default).get("/api/propostas");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
    it("POST deve retornar 400 sem dados", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/propostas")
            .send({});
        expect(res.status).toBe(400);
    });
    it("POST deve retornar 201 com dados válidos", async () => {
        PropostaRepository_1.PropostaRepository.create
            .mockResolvedValue(mockProposta);
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/propostas")
            .send({
            titulo: "Reforma banheiro",
            descricao: "Desenvolvimento de sistema",
            valor: 3500,
            status: "CRIADA",
            cliente_id: "456e4567-e89b-12d3-a456-426614174001",
            prestador_id: "789e4567-e89b-12d3-a456-426614174002",
        });
        expect(res.status).toBe(201);
    });
});

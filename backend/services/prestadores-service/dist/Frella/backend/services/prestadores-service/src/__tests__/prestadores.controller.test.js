"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const PrestadorRepository_1 = require("../infrastructure/database/PrestadorRepository");
jest.mock("../infrastructure/database/PrestadorRepository");
jest.mock('../infrastructure/cache/RedisCacheService', () => ({
    RedisCacheService: jest.fn().mockImplementation(() => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        invalidate: jest.fn().mockResolvedValue(undefined),
        invalidatePattern: jest.fn().mockResolvedValue(undefined),
    })),
}));
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
        PrestadorRepository_1.PrestadorRepository.findAll.mockResolvedValue([mockPrestador]);
        const res = await (0, supertest_1.default)(app_1.default).get("/api/prestadores");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
    it("POST /api/prestadores deve retornar 400 sem dados", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/prestadores")
            .send({});
        expect(res.status).toBe(400);
    });
    it("POST /api/prestadores deve retornar 201 com dados válidos", async () => {
        PrestadorRepository_1.PrestadorRepository.findByEmail.mockResolvedValue(null);
        PrestadorRepository_1.PrestadorRepository.create.mockResolvedValue(mockPrestador);
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/prestadores")
            .send({ nome: "João Silva", email: "joao@email.com", especialidades: ["Programação"] });
        expect(res.status).toBe(201);
        expect(res.body.email).toBe("joao@email.com");
    });
});

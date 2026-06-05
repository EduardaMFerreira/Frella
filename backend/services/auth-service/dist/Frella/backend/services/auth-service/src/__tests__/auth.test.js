"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const LoginUseCase_1 = require("../application/UseCases/login/LoginUseCase");
const RegisterUseCasse_1 = require("../application/UseCases/register/RegisterUseCasse");
// ── Mocks ──────────────────────────────────────────────────
jest.mock('../application/UseCases/login/LoginUseCase');
jest.mock('../application/UseCases/register/RegisterUseCasse');
// App de teste isolado — sem banco de dados real
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/register', auth_controller_1.AuthController.register);
app.post('/login', auth_controller_1.AuthController.login);
// ── Testes ─────────────────────────────────────────────────
describe('AuthController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // ── Register ─────────────────────────────────────────────
    describe('POST /register', () => {
        it('deve registrar um novo usuário e retornar 201', async () => {
            const mockUser = {
                id: 'uuid-123',
                email: 'novo@frella.com',
                role: 'cliente',
            };
            RegisterUseCasse_1.RegisterUseCase.mockResolvedValue(mockUser);
            const res = await (0, supertest_1.default)(app)
                .post('/register')
                .send({
                email: 'novo@frella.com',
                password: '123456',
                role: 'cliente',
            });
            expect(res.status).toBe(201);
            expect(res.body.email).toBe('novo@frella.com');
            expect(res.body.role).toBe('cliente');
            expect(RegisterUseCasse_1.RegisterUseCase).toHaveBeenCalledTimes(1);
        });
        it('deve retornar 400 se o email já estiver cadastrado', async () => {
            RegisterUseCasse_1.RegisterUseCase.mockRejectedValue(new Error('Email já cadastrado'));
            const res = await (0, supertest_1.default)(app)
                .post('/register')
                .send({
                email: 'existente@frella.com',
                password: '123456',
                role: 'cliente',
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email já cadastrado');
        });
        it('deve retornar 400 se o role for inválido', async () => {
            RegisterUseCasse_1.RegisterUseCase.mockRejectedValue(new Error('Role inválido'));
            const res = await (0, supertest_1.default)(app)
                .post('/register')
                .send({
                email: 'teste@frella.com',
                password: '123456',
                role: 'admin',
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Role inválido');
        });
    });
    // ── Login ─────────────────────────────────────────────────
    describe('POST /login', () => {
        it('deve fazer login e retornar token JWT', async () => {
            const mockResult = {
                token: 'jwt.token.aqui',
                user: {
                    id: 'uuid-123',
                    email: 'teste@frella.com',
                    role: 'cliente',
                },
            };
            LoginUseCase_1.LoginUseCase.mockResolvedValue(mockResult);
            const res = await (0, supertest_1.default)(app)
                .post('/login')
                .send({
                email: 'teste@frella.com',
                password: '123456',
            });
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe('teste@frella.com');
            expect(LoginUseCase_1.LoginUseCase).toHaveBeenCalledTimes(1);
        });
        it('deve retornar 401 se as credenciais forem inválidas', async () => {
            LoginUseCase_1.LoginUseCase.mockRejectedValue(new Error('Credenciais inválidas'));
            const res = await (0, supertest_1.default)(app)
                .post('/login')
                .send({
                email: 'teste@frella.com',
                password: 'senha_errada',
            });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Credenciais inválidas');
        });
        it('deve retornar 401 se o usuário não existir', async () => {
            LoginUseCase_1.LoginUseCase.mockRejectedValue(new Error('Credenciais inválidas'));
            const res = await (0, supertest_1.default)(app)
                .post('/login')
                .send({
                email: 'naoexiste@frella.com',
                password: '123456',
            });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Credenciais inválidas');
        });
    });
});

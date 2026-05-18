import request from 'supertest';
import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginUseCase } from '../application/UseCases/login/LoginUseCase';
import { RegisterUseCase } from '../application/UseCases/register/RegisterUseCasse';

// ── Mocks ──────────────────────────────────────────────────
jest.mock('../application/UseCases/login/LoginUseCase');
jest.mock('../application/UseCases/register/RegisterUseCasse');

// App de teste isolado — sem banco de dados real
const app = express();
app.use(express.json());
app.post('/register', AuthController.register);
app.post('/login', AuthController.login);

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

      (RegisterUseCase as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/register')
        .send({
          email: 'novo@frella.com',
          password: '123456',
          role: 'cliente',
        });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe('novo@frella.com');
      expect(res.body.role).toBe('cliente');
      expect(RegisterUseCase).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 400 se o email já estiver cadastrado', async () => {
      (RegisterUseCase as jest.Mock).mockRejectedValue(
        new Error('Email já cadastrado')
      );

      const res = await request(app)
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
      (RegisterUseCase as jest.Mock).mockRejectedValue(
        new Error('Role inválido')
      );

      const res = await request(app)
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

      (LoginUseCase as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app)
        .post('/login')
        .send({
          email: 'teste@frella.com',
          password: '123456',
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('teste@frella.com');
      expect(LoginUseCase).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 401 se as credenciais forem inválidas', async () => {
      (LoginUseCase as jest.Mock).mockRejectedValue(
        new Error('Credenciais inválidas')
      );

      const res = await request(app)
        .post('/login')
        .send({
          email: 'teste@frella.com',
          password: 'senha_errada',
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Credenciais inválidas');
    });

    it('deve retornar 401 se o usuário não existir', async () => {
      (LoginUseCase as jest.Mock).mockRejectedValue(
        new Error('Credenciais inválidas')
      );

      const res = await request(app)
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
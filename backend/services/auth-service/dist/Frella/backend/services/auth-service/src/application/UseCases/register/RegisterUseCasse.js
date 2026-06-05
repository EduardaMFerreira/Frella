"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = RegisterUseCase;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserRepository_1 = require("../../../infrastructure/database/UserRepository");
const logger_1 = require("../../../infrastructure/logger");
async function RegisterUseCase(data) {
    logger_1.logger.info('Tentativa de registro', { email: data.email, role: data.role });
    const existing = await UserRepository_1.UserRepository.findByEmail(data.email);
    if (existing) {
        logger_1.logger.warn('Registro falhou — e-mail já cadastrado', { email: data.email });
        throw new Error("Email já cadastrado");
    }
    const hashed = await bcryptjs_1.default.hash(data.password, 10);
    const user = await UserRepository_1.UserRepository.create({ ...data, password: hashed });
    logger_1.logger.info('Usuário registrado com sucesso', { userId: user.id, role: user.role });
    return user;
}

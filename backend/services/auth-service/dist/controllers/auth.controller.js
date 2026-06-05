"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const RegisterUseCasse_1 = require("../application/UseCases/register/RegisterUseCasse");
const LoginUseCase_1 = require("../application/UseCases/login/LoginUseCase");
const LogoutUseCase_1 = require("../application/UseCases/logout/LogoutUseCase");
exports.AuthController = {
    async register(req, res) {
        try {
            const result = await (0, RegisterUseCasse_1.RegisterUseCase)(req.body);
            res.status(201).json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async login(req, res) {
        try {
            const ip = req.ip || req.socket.remoteAddress || 'unknown';
            const result = await (0, LoginUseCase_1.LoginUseCase)(req.body, ip);
            res.status(200).json(result);
        }
        catch (err) {
            const status = err.message.includes('Muitas tentativas') ? 429 : 401;
            res.status(status).json({ error: err.message });
        }
    },
    async logout(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ error: "Token não fornecido" });
                return;
            }
            const token = authHeader.split(" ")[1];
            await (0, LogoutUseCase_1.LogoutUseCase)(token);
            res.status(200).json({ message: "Logout realizado com sucesso" });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

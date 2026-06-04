import { Request, Response } from "express";
import { RegisterUseCase } from "../application/UseCases/register/RegisterUseCasse";
import { LoginUseCase } from "../application/UseCases/login/LoginUseCase";
import { LogoutUseCase } from "../application/UseCases/logout/LogoutUseCase";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const result = await RegisterUseCase(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await LoginUseCase(req.body);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token não fornecido" });
        return;
      }

      const token = authHeader.split(" ")[1];
      await LogoutUseCase(token);

      res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
};
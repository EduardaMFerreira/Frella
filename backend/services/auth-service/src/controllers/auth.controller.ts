import { Request, Response } from "express";
import { RegisterUseCase } from "../application/UseCases/register/RegisterUseCasse";
import { LoginUseCase } from "../application/UseCases/login/LoginUseCase";

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
};
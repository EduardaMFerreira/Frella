import { Request, Response } from "express";
import { CriarPropostaHandler } from "../application/commands/criarProposta/CriarPropostaHandler";
import { BuscarPropostaHandler } from "../application/queries/buscarProposta/BuscarPropostaHandler";

const criarHandler = new CriarPropostaHandler();
const buscarHandler = new BuscarPropostaHandler();

export class PropostasController {

  async criar(req: Request, res: Response) {
    try {
      const result = await criarHandler.execute(req.body);
      return res.status(201).json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const result = await buscarHandler.execute({ id });

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  }
}
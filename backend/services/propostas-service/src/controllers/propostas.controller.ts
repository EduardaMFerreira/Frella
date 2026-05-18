import { Request, Response } from "express";
import { CriarPropostaHandler } from "../application/commands/criarProposta/CriarPropostaHandler";
import { AceitarPropostaHandler } from "../application/commands/aceitarProposta/AceitarPropostaHandler";
import { RemoverPropostaHandler } from "../application/commands/removerProposta/RemoverPropostaHandler";
import { BuscarPropostaHandler } from "../application/queries/buscarProposta/BuscarPropostaHandler";
import { ListarPropostasHandler } from "../application/queries/listarPropostas/ListarPropostasHandler";

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
      return res.status(404).json({ message: e.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const query = {
        cliente_id: req.query.cliente_id as string | undefined,
        prestador_id: req.query.prestador_id as string | undefined,
      };
      const result = await ListarPropostasHandler(query);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  }

  async aceitar(req: Request, res: Response) {
    try {
      const result = await AceitarPropostaHandler({
        proposta_id: String(req.params.id),
      });
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      await RemoverPropostaHandler({ id: String(req.params.id) });
      return res.status(204).send();
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  }
}
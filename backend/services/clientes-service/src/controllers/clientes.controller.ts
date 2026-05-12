import { Request, Response } from "express";
import { CriarClienteUseCase } from "../application/useCases/criarCliente/CriarClinteUseCase";
import {
  BuscarClienteUseCase,
  ListarClientesUseCase,
  AtualizarClienteUseCase,
  RemoverClienteUseCase,
} from "../application/useCases/bucarCliente/BucarClienteUseCase";

export const getAll = async (req: Request, res: Response) => {
  try {
    const clientes = await ListarClientesUseCase();
    res.status(200).json(clientes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const cliente = await BuscarClienteUseCase(req.params.id);
    res.status(200).json(cliente);
  } catch (err: any) {
    const status = err.message === "Cliente não encontrado" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const cliente = await CriarClienteUseCase(req.body);
    res.status(201).json(cliente);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const cliente = await AtualizarClienteUseCase(req.params.id, req.body);
    res.status(200).json(cliente);
  } catch (err: any) {
    const status = err.message === "Cliente não encontrado" ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

export const remove = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await RemoverClienteUseCase(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    const status = err.message === "Cliente não encontrado" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
};
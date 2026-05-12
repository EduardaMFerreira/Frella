import { Request, Response } from "express";
import { CriarPrestadorUseCase } from "../application/useCases/criarPrestador/CriarPrestadorUseCase";
import {
  BuscarPrestadorUseCase,
  ListarPrestadoresUseCase,
  ListarPorEspecialidadeUseCase,
} from "../application/useCases/bucarPrestador/BucarPrestadorUseCase";
import {
  AtualizarPrestadorUseCase,
  RemoverPrestadorUseCase,
} from "../application/useCases/atualizarPrestador/AtualizarPrestadorUseCase";

export const getAll = async (req: Request, res: Response) => {
  try {
    const { especialidade } = req.query;
    if (especialidade) {
      const prestadores = await ListarPorEspecialidadeUseCase(especialidade as string);
      return res.status(200).json(prestadores);
    }
    const prestadores = await ListarPrestadoresUseCase();
    res.status(200).json(prestadores);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const prestador = await BuscarPrestadorUseCase(req.params.id);
    res.status(200).json(prestador);
  } catch (err: any) {
    const status = err.message === "Prestador não encontrado" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const prestador = await CriarPrestadorUseCase(req.body);
    res.status(201).json(prestador);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const prestador = await AtualizarPrestadorUseCase(req.params.id, req.body);
    res.status(200).json(prestador);
  } catch (err: any) {
    const status = err.message === "Prestador não encontrado" ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

export const remove = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await RemoverPrestadorUseCase(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    const status = err.message === "Prestador não encontrado" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
};
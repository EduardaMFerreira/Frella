import { Request, Response } from "express";

export const getAll = (req: Request, res: Response) => {
  res.status(200).json([]);
};

export const getById = (req: Request, res: Response) => {
  res.status(200).json({ id: req.params.id });
};

export const create = (req: Request, res: Response) => {
  if (!req.body.nome) {
    return res.status(400).json({ error: "Nome obrigatório" });
  }

  res.status(201).json({ message: "Criado com sucesso" });
};

export const update = (req: Request, res: Response) => {
  res.status(200).json({ message: "Atualizado" });
};

export const remove = (req: Request, res: Response) => {
  res.status(204).send();
};
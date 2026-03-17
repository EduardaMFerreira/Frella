import { Request, Response } from "express";

export const getAll = (_req: Request, res: Response) => {
  res.status(200).json([]);
};

export const getById = (req: Request, res: Response) => {
  res.status(200).json({ id: req.params.id });
};

export const create = (req: Request, res: Response) => {
  if (!req.body.titulo) {
    return res.status(400).json({ error: "Título obrigatório" });
  }

  res.status(201).json({ message: "Contrato criado com sucesso" });
};

export const update = (req: Request, res: Response) => {
  res.status(200).json({ message: "Contrato atualizado" });
};

export const remove = (_req: Request, res: Response) => {
  res.status(204).send();
};
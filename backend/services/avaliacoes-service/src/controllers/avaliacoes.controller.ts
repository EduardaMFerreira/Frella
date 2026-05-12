import { Request, Response } from "express";

import { CriarAvaliacaoUseCase } from "../application/useCases/criarAvaliacao/CriarAvaliacaoUseCase";

import {
  BuscarAvaliacaoUseCase,
  ListarAvaliacoesUseCase,
  RemoverAvaliacaoUseCase,
} from "../application/useCases/buscarAvaliacoes/BuscarAvaliacoesUseCase";

export const getAll = async (
  req: Request,
  res: Response
) => {

  try {

    const avaliacoes = await ListarAvaliacoesUseCase();

    res.status(200).json(avaliacoes);

  } catch (err: any) {

    res.status(500).json({
      error: err.message,
    });
  }
};

export const getById = async (
  req: Request<{ id: string }>,
  res: Response
) => {

  try {

    const avaliacao = await BuscarAvaliacaoUseCase(
      req.params.id
    );

    res.status(200).json(avaliacao);

  } catch (err: any) {

    const status =
      err.message === "Avaliação não encontrada"
        ? 404
        : 500;

    res.status(status).json({
      error: err.message,
    });
  }
};

export const create = async (
  req: Request,
  res: Response
) => {

  try {

    const avaliacao = await CriarAvaliacaoUseCase(
      req.body
    );

    res.status(201).json(avaliacao);

  } catch (err: any) {

    res.status(400).json({
      error: err.message,
    });
  }
};

export const remove = async (
  req: Request<{ id: string }>,
  res: Response
) => {

  try {

    await RemoverAvaliacaoUseCase(
      req.params.id
    );

    res.status(204).send();

  } catch (err: any) {

    const status =
      err.message === "Avaliação não encontrada"
        ? 404
        : 500;

    res.status(status).json({
      error: err.message,
    });
  }
};
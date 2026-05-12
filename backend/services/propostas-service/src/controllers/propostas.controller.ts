import { Request, Response } from "express";

import { CriarPropostaUseCase } from "../application/useCases/criarProposta/CriarPropostaUseCase";

import {
  BuscarPropostaUseCase,
  ListarPropostasUseCase,
  RemoverPropostaUseCase,
} from "../application/useCases/listarPropostas/ListarPropostasUseCase";

import { AceitarPropostaUseCase } from "../application/useCases/aceitarProposta/AceitarPropostaUseCase";

export const getAll = async (
  req: Request,
  res: Response
) => {

  try {

    const propostas = await ListarPropostasUseCase();

    res.status(200).json(propostas);

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

    const proposta = await BuscarPropostaUseCase(
      req.params.id
    );

    res.status(200).json(proposta);

  } catch (err: any) {

    const status =
      err.message === "Proposta não encontrada"
        ? 404
        : 400;

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

    const proposta = await CriarPropostaUseCase(
      req.body
    );

    res.status(201).json(proposta);

  } catch (err: any) {

    res.status(400).json({
      error: err.message,
    });

  }

};

export const aceitar = async (
  req: Request<{ id: string }>,
  res: Response
) => {

  try {

    const proposta = await AceitarPropostaUseCase(
      req.params.id
    );

    res.status(200).json(proposta);

  } catch (err: any) {

    const status =
      err.message === "Proposta não encontrada"
        ? 404
        : 400;

    res.status(status).json({
      error: err.message,
    });

  }

};

export const remove = async (
  req: Request<{ id: string }>,
  res: Response
) => {

  try {

    await RemoverPropostaUseCase(
      req.params.id
    );

    res.status(204).send();

  } catch (err: any) {

    const status =
      err.message === "Proposta não encontrada"
        ? 404
        : 400;

    res.status(status).json({
      error: err.message,
    });

  }

};
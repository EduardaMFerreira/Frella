import { Request, Response } from "express";
import { CriarContratoUseCase } from "../application/useCases/criarContrato/CriarContratoUseCase";
import { IniciarServicoUseCase } from "../application/useCases/iniciarServico/IniciarServicoUseCase";
import { FinalizarServicoUseCase, CancelarContratoUseCase } from "../application/useCases/finalizarServico/FinalizarServicoUseCase";
import { ContratoRepository } from "../infrastructure/database/ContratoRepository";

export const getAll = async (req: Request, res: Response) => {
  try {
    const { cliente_id, prestador_id } = req.query;
    if (cliente_id) {
      const contratos = await ContratoRepository.findByClienteId(cliente_id as string);
      return res.status(200).json(contratos);
    }
    if (prestador_id) {
      const contratos = await ContratoRepository.findByPrestadorId(prestador_id as string);
      return res.status(200).json(contratos);
    }
    const contratos = await ContratoRepository.findAll();
    res.status(200).json(contratos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const contrato = await ContratoRepository.findById(req.params.id);
    if (!contrato) return res.status(404).json({ error: "Contrato não encontrado" });
    res.status(200).json(contrato);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const contrato = await CriarContratoUseCase(req.body);
    res.status(201).json(contrato);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const iniciar = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const contrato = await IniciarServicoUseCase(req.params.id);
    res.status(200).json(contrato);
  } catch (err: any) {
    const status = err.message === "Contrato não encontrado" ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

export const finalizar = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const contrato = await FinalizarServicoUseCase(req.params.id);
    res.status(200).json(contrato);
  } catch (err: any) {
    const status = err.message === "Contrato não encontrado" ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

export const cancelar = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const contrato = await CancelarContratoUseCase(req.params.id);
    res.status(200).json(contrato);
  } catch (err: any) {
    const status = err.message === "Contrato não encontrado" ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

export const remove = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await ContratoRepository.remove(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
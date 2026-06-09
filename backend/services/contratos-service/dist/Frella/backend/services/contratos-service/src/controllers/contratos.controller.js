"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.cancelar = exports.finalizar = exports.iniciar = exports.create = exports.getById = exports.getAll = void 0;
const CriarContratoUseCase_1 = require("../application/useCases/criarContrato/CriarContratoUseCase");
const IniciarServicoUseCase_1 = require("../application/useCases/iniciarServico/IniciarServicoUseCase");
const FinalizarServicoUseCase_1 = require("../application/useCases/finalizarServico/FinalizarServicoUseCase");
const ContratoRepository_1 = require("../infrastructure/database/ContratoRepository");
const getAll = async (req, res) => {
    try {
        const { cliente_id, prestador_id } = req.query;
        if (cliente_id) {
            const contratos = await ContratoRepository_1.ContratoRepository.findByClienteId(cliente_id);
            return res.status(200).json(contratos);
        }
        if (prestador_id) {
            const contratos = await ContratoRepository_1.ContratoRepository.findByPrestadorId(prestador_id);
            return res.status(200).json(contratos);
        }
        const contratos = await ContratoRepository_1.ContratoRepository.findAll();
        res.status(200).json(contratos);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const contrato = await ContratoRepository_1.ContratoRepository.findById(req.params.id);
        if (!contrato)
            return res.status(404).json({ error: "Contrato não encontrado" });
        res.status(200).json(contrato);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    try {
        const contrato = await (0, CriarContratoUseCase_1.CriarContratoUseCase)(req.body);
        res.status(201).json(contrato);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.create = create;
const iniciar = async (req, res) => {
    try {
        const contrato = await (0, IniciarServicoUseCase_1.IniciarServicoUseCase)(req.params.id);
        res.status(200).json(contrato);
    }
    catch (err) {
        const status = err.message === "Contrato não encontrado" ? 404 : 400;
        res.status(status).json({ error: err.message });
    }
};
exports.iniciar = iniciar;
const finalizar = async (req, res) => {
    try {
        const contrato = await (0, FinalizarServicoUseCase_1.FinalizarServicoUseCase)(req.params.id);
        res.status(200).json(contrato);
    }
    catch (err) {
        const status = err.message === "Contrato não encontrado" ? 404 : 400;
        res.status(status).json({ error: err.message });
    }
};
exports.finalizar = finalizar;
const cancelar = async (req, res) => {
    try {
        const contrato = await (0, FinalizarServicoUseCase_1.CancelarContratoUseCase)(req.params.id);
        res.status(200).json(contrato);
    }
    catch (err) {
        const status = err.message === "Contrato não encontrado" ? 404 : 400;
        res.status(status).json({ error: err.message });
    }
};
exports.cancelar = cancelar;
const remove = async (req, res) => {
    try {
        await ContratoRepository_1.ContratoRepository.remove(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.remove = remove;

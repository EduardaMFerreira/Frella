"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const CriarPrestadorUseCase_1 = require("../application/useCases/criarPrestador/CriarPrestadorUseCase");
const BucarPrestadorUseCase_1 = require("../application/useCases/bucarPrestador/BucarPrestadorUseCase");
const AtualizarPrestadorUseCase_1 = require("../application/useCases/atualizarPrestador/AtualizarPrestadorUseCase");
const getAll = async (req, res) => {
    try {
        const { especialidade } = req.query;
        if (especialidade) {
            const prestadores = await (0, BucarPrestadorUseCase_1.ListarPorEspecialidadeUseCase)(especialidade);
            return res.status(200).json(prestadores);
        }
        const prestadores = await (0, BucarPrestadorUseCase_1.ListarPrestadoresUseCase)();
        res.status(200).json(prestadores);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const prestador = await (0, BucarPrestadorUseCase_1.BuscarPrestadorUseCase)(req.params.id);
        res.status(200).json(prestador);
    }
    catch (err) {
        const status = err.message === "Prestador não encontrado" ? 404 : 500;
        res.status(status).json({ error: err.message });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    try {
        const prestador = await (0, CriarPrestadorUseCase_1.CriarPrestadorUseCase)(req.body);
        res.status(201).json(prestador);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    try {
        const prestador = await (0, AtualizarPrestadorUseCase_1.AtualizarPrestadorUseCase)(req.params.id, req.body);
        res.status(200).json(prestador);
    }
    catch (err) {
        const status = err.message === "Prestador não encontrado" ? 404 : 400;
        res.status(status).json({ error: err.message });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await (0, AtualizarPrestadorUseCase_1.RemoverPrestadorUseCase)(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        const status = err.message === "Prestador não encontrado" ? 404 : 500;
        res.status(status).json({ error: err.message });
    }
};
exports.remove = remove;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.create = exports.getById = exports.getAll = void 0;
const CriarAvaliacaoUseCase_1 = require("../application/useCases/criarAvaliacao/CriarAvaliacaoUseCase");
const BuscarAvaliacoesUseCase_1 = require("../application/useCases/buscarAvaliacoes/BuscarAvaliacoesUseCase");
const getAll = async (req, res) => {
    try {
        const avaliacoes = await (0, BuscarAvaliacoesUseCase_1.ListarAvaliacoesUseCase)();
        res.status(200).json(avaliacoes);
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const avaliacao = await (0, BuscarAvaliacoesUseCase_1.BuscarAvaliacaoUseCase)(req.params.id);
        res.status(200).json(avaliacao);
    }
    catch (err) {
        const status = err.message === "Avaliação não encontrada"
            ? 404
            : 500;
        res.status(status).json({
            error: err.message,
        });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    try {
        const avaliacao = await (0, CriarAvaliacaoUseCase_1.CriarAvaliacaoUseCase)(req.body);
        res.status(201).json(avaliacao);
    }
    catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
};
exports.create = create;
const remove = async (req, res) => {
    try {
        await (0, BuscarAvaliacoesUseCase_1.RemoverAvaliacaoUseCase)(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        const status = err.message === "Avaliação não encontrada"
            ? 404
            : 500;
        res.status(status).json({
            error: err.message,
        });
    }
};
exports.remove = remove;

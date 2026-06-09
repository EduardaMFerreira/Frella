"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropostasController = void 0;
const CriarPropostaHandler_1 = require("../application/commands/criarProposta/CriarPropostaHandler");
const AceitarPropostaHandler_1 = require("../application/commands/aceitarProposta/AceitarPropostaHandler");
const RemoverPropostaHandler_1 = require("../application/commands/removerProposta/RemoverPropostaHandler");
const BuscarPropostaHandler_1 = require("../application/queries/buscarProposta/BuscarPropostaHandler");
const ListarPropostasHandler_1 = require("../application/queries/listarPropostas/ListarPropostasHandler");
const criarHandler = new CriarPropostaHandler_1.CriarPropostaHandler();
const buscarHandler = new BuscarPropostaHandler_1.BuscarPropostaHandler();
class PropostasController {
    async criar(req, res) {
        try {
            const result = await criarHandler.execute(req.body);
            return res.status(201).json(result);
        }
        catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async buscarPorId(req, res) {
        try {
            const id = String(req.params.id);
            const result = await buscarHandler.execute({ id });
            return res.status(200).json(result);
        }
        catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }
    async listar(req, res) {
        try {
            const query = {
                cliente_id: req.query.cliente_id,
                prestador_id: req.query.prestador_id,
            };
            const result = await (0, ListarPropostasHandler_1.ListarPropostasHandler)(query);
            return res.status(200).json(result);
        }
        catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async aceitar(req, res) {
        try {
            const result = await (0, AceitarPropostaHandler_1.AceitarPropostaHandler)({
                proposta_id: String(req.params.id),
            });
            return res.status(200).json(result);
        }
        catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async remover(req, res) {
        try {
            await (0, RemoverPropostaHandler_1.RemoverPropostaHandler)({ id: String(req.params.id) });
            return res.status(204).send();
        }
        catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
}
exports.PropostasController = PropostasController;

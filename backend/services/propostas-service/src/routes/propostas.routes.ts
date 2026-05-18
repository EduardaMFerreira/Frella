import { Router } from "express";
import { PropostasController } from "../controllers/propostas.controller";

const router = Router();
const controller = new PropostasController();

router.post("/", (req, res) => controller.criar(req, res));
router.get("/", (req, res) => controller.listar(req, res));
router.get("/:id", (req, res) => controller.buscarPorId(req, res));
router.put("/:id/aceitar", (req, res) => controller.aceitar(req, res));
router.delete("/:id", (req, res) => controller.remover(req, res));

export default router;
import { Router } from "express";
import { PropostasController } from "../controllers/propostas.controller";

const router = Router();
const controller = new PropostasController();

router.post("/", (req, res) => controller.criar(req, res));

router.get("/:id", (req, res) => controller.buscarPorId(req, res));

export default router;
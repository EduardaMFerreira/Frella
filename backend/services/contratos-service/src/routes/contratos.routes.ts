import { Router } from "express";
import * as controller from "../controllers/contratos.controller";

const router = Router();

/**
 * @swagger
 * /api/contratos:
 *   get:
 *     summary: Lista contratos
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/contratos/{id}:
 *   get:
 *     summary: Busca contrato por ID
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/contratos:
 *   post:
 *     summary: Cria contrato
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/contratos/{id}:
 *   put:
 *     summary: Atualiza contrato
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /api/contratos/{id}:
 *   delete:
 *     summary: Remove contrato
 */
router.delete("/:id", controller.remove);

export default router;
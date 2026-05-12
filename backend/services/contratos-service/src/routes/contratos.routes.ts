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
 * /api/contratos/{id}/iniciar:
 *   patch:
 *     summary: Inicia um contrato pendente
 */
router.patch("/:id/iniciar", controller.iniciar);

/**
 * @swagger
 * /api/contratos/{id}/finalizar:
 *   patch:
 *     summary: Finaliza um contrato em andamento
 */
router.patch("/:id/finalizar", controller.finalizar);

/**
 * @swagger
 * /api/contratos/{id}/cancelar:
 *   patch:
 *     summary: Cancela um contrato
 */
router.patch("/:id/cancelar", controller.cancelar);

/**
 * @swagger
 * /api/contratos/{id}:
 *   delete:
 *     summary: Remove contrato
 */
router.delete("/:id", controller.remove);

export default router;
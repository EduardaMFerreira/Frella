import { Router } from "express";

import * as controller from "../controllers/propostas.controller";

const router = Router();

/**
 * @swagger
 * /api/propostas:
 *   get:
 *     summary: Lista todas propostas
 *     tags:
 *       - Propostas
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/propostas/{id}:
 *   get:
 *     summary: Busca proposta por ID
 *     tags:
 *       - Propostas
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/propostas:
 *   post:
 *     summary: Cria uma proposta
 *     tags:
 *       - Propostas
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/propostas/{id}/aceitar:
 *   patch:
 *     summary: Aceita proposta
 *     tags:
 *       - Propostas
 */
router.patch("/:id/aceitar", controller.aceitar);

/**
 * @swagger
 * /api/propostas/{id}:
 *   delete:
 *     summary: Remove proposta
 *     tags:
 *       - Propostas
 */
router.delete("/:id", controller.remove);

export default router;
import { Router } from "express";
import * as controller from "../controllers/avaliacoes.controller";

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todas avaliações
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Busca avaliação por ID
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria avaliação
 */
router.post("/", controller.create);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Atualiza avaliação
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Remove avaliação
 */
router.delete("/:id", controller.remove);

export default router;
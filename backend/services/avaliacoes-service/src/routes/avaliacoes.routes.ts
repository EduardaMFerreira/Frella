import { Router } from "express";
import * as controller from "../controllers/avaliacoes.controller";

const router = Router();
router.get("/health", (_, res) => res.json({ status: "ok", service: "avaliacoes-service" }));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todas avaliações
 *     parameters:
 *       - in: query
 *         name: cliente_id
 *         required: false
 *         schema:
 *           type: string
 *         example: 434f2efd-601b-4700-8b2f-7d3056925828
 *       - in: query
 *         name: prestador_id
 *         required: false
 *         schema:
 *           type: string
 *         example: ebee7354-3d40-49c4-9d4a-95fefece4f6c
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Avaliação encontrada
 *       404:
 *         description: Não encontrada
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Avaliacao'
 *     responses:
 *       201:
 *         description: Avaliação criada
 */
router.post("/", controller.create);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Remove avaliação
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Avaliação removida
 */
router.delete("/:id", controller.remove);

export default router;
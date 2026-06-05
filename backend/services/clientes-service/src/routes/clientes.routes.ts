import { Router } from "express";
import * as controller from "../controllers/clientes.controller";

const router = Router();
router.get("/health", (_, res) => res.json({ status: "ok", service: "clientes-service" }));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todos clientes
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         example: Maria
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *         example: maria@email.com
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Busca cliente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 434f2efd-601b-4700-8b2f-7d3056925828
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Não encontrado
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente criado
 */
router.post("/", controller.create);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Atualiza cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 434f2efd-601b-4700-8b2f-7d3056925828
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente atualizado
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Remove cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 434f2efd-601b-4700-8b2f-7d3056925828
 *     responses:
 *       204:
 *         description: Cliente removido
 */
router.delete("/:id", controller.remove);

export default router;
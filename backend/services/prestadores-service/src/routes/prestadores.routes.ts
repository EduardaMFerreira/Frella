import { Router } from "express";
import * as controller from "../controllers/prestadores.controller";

const router = Router();
router.get("/health", (_, res) => res.json({ status: "ok", service: "prestadores-service" }));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todos prestadores
 *     parameters:
 *       - in: query
 *         name: especialidade
 *         required: false
 *         schema:
 *           type: string
 *         example: encanamento
 *     responses:
 *       200:
 *         description: Lista de prestadores
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Busca prestador por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: ebee7354-3d40-49c4-9d4a-95fefece4f6c
 *     responses:
 *       200:
 *         description: Prestador encontrado
 *       404:
 *         description: Não encontrado
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria prestador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prestador'
 *     responses:
 *       201:
 *         description: Prestador criado
 */
router.post("/", controller.create);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Atualiza prestador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prestador'
 *     responses:
 *       200:
 *         description: Prestador atualizado
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Remove prestador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: ebee7354-3d40-49c4-9d4a-95fefece4f6c
 *     responses:
 *       204:
 *         description: Prestador removido
 */
router.delete("/:id", controller.remove);

export default router;
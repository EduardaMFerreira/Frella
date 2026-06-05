import { Router } from "express";
import * as controller from "../controllers/contratos.controller";

const router = Router();
router.get("/health", (_, res) => res.json({ status: "ok", service: "contratos-service" }));

/**
 * @swagger
 * /api/contratos:
 *   get:
 *     summary: Lista contratos
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
 *         description: Lista de contratos
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/contratos/{id}:
 *   get:
 *     summary: Busca contrato por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contrato encontrado
 *       404:
 *         description: Não encontrado
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/contratos:
 *   post:
 *     summary: Cria contrato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contrato'
 *     responses:
 *       201:
 *         description: Contrato criado
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/contratos/{id}/iniciar:
 *   patch:
 *     summary: Inicia um contrato pendente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contrato iniciado
 */
router.patch("/:id/iniciar", controller.iniciar);

/**
 * @swagger
 * /api/contratos/{id}/finalizar:
 *   patch:
 *     summary: Finaliza um contrato em andamento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contrato finalizado
 */
router.patch("/:id/finalizar", controller.finalizar);

/**
 * @swagger
 * /api/contratos/{id}/cancelar:
 *   patch:
 *     summary: Cancela um contrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contrato cancelado
 */
router.patch("/:id/cancelar", controller.cancelar);

/**
 * @swagger
 * /api/contratos/{id}:
 *   delete:
 *     summary: Remove contrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contrato removido
 */
router.delete("/:id", controller.remove);

export default router;
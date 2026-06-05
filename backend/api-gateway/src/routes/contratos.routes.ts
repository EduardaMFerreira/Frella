import { Router } from "express";
import { services } from "../config/services";
import { createServiceProxy } from "../utils/proxy";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Contratos
 *   description: Gestão de contratos
 */

/**
 * @swagger
 * /api/v1/contratos:
 *   get:
 *     summary: Lista contratos
 *     tags: [Contratos]
 *     responses:
 *       200:
 *         description: Lista de contratos
 *   post:
 *     summary: Cria contrato
 *     tags: [Contratos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contrato'
 *     responses:
 *       201:
 *         description: Contrato criado
 *
 * /api/v1/contratos/{id}:
 *   get:
 *     summary: Busca contrato por ID
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contrato encontrado
 *   delete:
 *     summary: Remove contrato
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contrato removido
 *
 * /api/v1/contratos/{id}/iniciar:
 *   patch:
 *     summary: Inicia contrato
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contrato iniciado
 *
 * /api/v1/contratos/{id}/finalizar:
 *   patch:
 *     summary: Finaliza contrato
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contrato finalizado
 *
 * /api/v1/contratos/{id}/cancelar:
 *   patch:
 *     summary: Cancela contrato
 *     tags: [Contratos]
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

router.use("/", createServiceProxy(services.contratos));

export default router;
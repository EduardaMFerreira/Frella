import { Router } from "express";
import { services } from "../config/services";
import { createServiceProxy } from "../utils/proxy";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Propostas
 *   description: Gestão de propostas
 */

/**
 * @swagger
 * /api/v1/propostas:
 *   get:
 *     summary: Lista propostas
 *     tags: [Propostas]
 *     responses:
 *       200:
 *         description: Lista de propostas
 *   post:
 *     summary: Cria proposta
 *     tags: [Propostas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proposta'
 *     responses:
 *       201:
 *         description: Proposta criada
 *
 * /api/v1/propostas/{id}:
 *   get:
 *     summary: Busca proposta por ID
 *     tags: [Propostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proposta encontrada
 *   delete:
 *     summary: Remove proposta
 *     tags: [Propostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Proposta removida
 *
 * /api/v1/propostas/{id}/aceitar:
 *   patch:
 *     summary: Aceita proposta
 *     tags: [Propostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proposta aceita
 *
 * /api/v1/propostas/{id}/recusar:
 *   patch:
 *     summary: Recusa proposta
 *     tags: [Propostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proposta recusada
 */

router.use("/", createServiceProxy(services.propostas));

export default router;
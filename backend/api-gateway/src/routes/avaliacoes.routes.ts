import { Router } from "express";
import { services } from "../config/services";
import { createServiceProxy } from "../utils/proxy";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Avaliacoes
 *   description: Gestão de avaliações
 */

/**
 * @swagger
 * /api/v1/avaliacoes:
 *   get:
 *     summary: Lista avaliações
 *     tags: [Avaliacoes]
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *   post:
 *     summary: Cria avaliação
 *     tags: [Avaliacoes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Avaliacao'
 *     responses:
 *       201:
 *         description: Avaliação criada
 *
 * /api/v1/avaliacoes/{id}:
 *   get:
 *     summary: Busca avaliação por ID
 *     tags: [Avaliacoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Avaliação encontrada
 *   delete:
 *     summary: Remove avaliação
 *     tags: [Avaliacoes]
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

router.use("/", createServiceProxy(services.avaliacoes));

export default router;
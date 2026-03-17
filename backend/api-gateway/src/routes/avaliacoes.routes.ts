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
 * components:
 *   schemas:
 *     Avaliacao:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nota:
 *           type: number
 *         comentario:
 *           type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avaliacao'
 *
 *   post:
 *     summary: Cria avaliação
 *     tags: [Avaliacoes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação criada
 */

router.use("/", createServiceProxy(services.avaliacoes));

export default router;
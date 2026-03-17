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
 * components:
 *   schemas:
 *     Proposta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         descricao:
 *           type: string
 *         valor:
 *           type: number
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
 *
 *   post:
 *     summary: Cria proposta
 *     tags: [Propostas]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Criada
 */

router.use("/", createServiceProxy(services.propostas));

export default router;
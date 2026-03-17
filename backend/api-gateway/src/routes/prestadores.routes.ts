import { Router } from "express";
import { services } from "../config/services";
import { createServiceProxy } from "../utils/proxy";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Prestadores
 *   description: Gestão de prestadores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Prestador:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         servico:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/prestadores:
 *   get:
 *     summary: Lista prestadores
 *     tags: [Prestadores]
 *     responses:
 *       200:
 *         description: Lista de prestadores
 *
 *   post:
 *     summary: Cria prestador
 *     tags: [Prestadores]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Criado
 */

router.use("/", createServiceProxy(services.prestadores));

export default router;
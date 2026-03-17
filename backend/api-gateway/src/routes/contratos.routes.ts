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
 * components:
 *   schemas:
 *     Contrato:
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
 * /api/v1/contratos:
 *   get:
 *     summary: Lista contratos
 *     tags: [Contratos]
 *     responses:
 *       200:
 *         description: Lista de contratos
 *
 *   post:
 *     summary: Cria contrato
 *     tags: [Contratos]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Contrato criado
 */

router.use("/", createServiceProxy(services.contratos));

export default router;
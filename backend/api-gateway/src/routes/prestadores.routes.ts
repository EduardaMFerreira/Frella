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
 * /api/v1/prestadores:
 *   get:
 *     summary: Lista prestadores
 *     tags: [Prestadores]
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
 *   post:
 *     summary: Cria prestador
 *     tags: [Prestadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prestador'
 *     responses:
 *       201:
 *         description: Prestador criado
 *
 * /api/v1/prestadores/{id}:
 *   get:
 *     summary: Busca prestador por ID
 *     tags: [Prestadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prestador encontrado
 *   put:
 *     summary: Atualiza prestador
 *     tags: [Prestadores]
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
 *   delete:
 *     summary: Remove prestador
 *     tags: [Prestadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Prestador removido
 */

router.use("/", createServiceProxy(services.prestadores));

export default router;
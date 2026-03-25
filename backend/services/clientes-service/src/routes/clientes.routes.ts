import { Router } from "express";
import * as controller from "../controllers/clientes.controller";

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todos clientes
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Busca cliente por ID
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria cliente
 */
router.post("/", controller.create);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Atualiza cliente
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Remove cliente
 */
router.delete("/:id", controller.remove);

export default router;
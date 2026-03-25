import { Router } from "express";
import * as controller from "../controllers/prestadores.controller";

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todos prestadores
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Busca prestador por ID
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria prestador
 */
router.post("/", controller.create);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Atualiza prestador
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Remove prestador
 */
router.delete("/:id", controller.remove);

export default router;
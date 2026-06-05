"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("../controllers/contratos.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/contratos:
 *   get:
 *     summary: Lista contratos
 */
router.get("/", controller.getAll);
/**
 * @swagger
 * /api/contratos/{id}:
 *   get:
 *     summary: Busca contrato por ID
 */
router.get("/:id", controller.getById);
/**
 * @swagger
 * /api/contratos:
 *   post:
 *     summary: Cria contrato
 */
router.post("/", controller.create);
/**
 * @swagger
 * /api/contratos/{id}/iniciar:
 *   patch:
 *     summary: Inicia um contrato pendente
 */
router.patch("/:id/iniciar", controller.iniciar);
/**
 * @swagger
 * /api/contratos/{id}/finalizar:
 *   patch:
 *     summary: Finaliza um contrato em andamento
 */
router.patch("/:id/finalizar", controller.finalizar);
/**
 * @swagger
 * /api/contratos/{id}/cancelar:
 *   patch:
 *     summary: Cancela um contrato
 */
router.patch("/:id/cancelar", controller.cancelar);
/**
 * @swagger
 * /api/contratos/{id}:
 *   delete:
 *     summary: Remove contrato
 */
router.delete("/:id", controller.remove);
exports.default = router;

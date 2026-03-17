import { Router } from "express";
import { services } from "../config/services";
import { createServiceProxy } from "../utils/proxy";

const router = Router();

router.use("/", createServiceProxy(services.avaliacoes));

export default router;
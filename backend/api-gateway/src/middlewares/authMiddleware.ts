import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { logger } from "./loggerMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || "frella_secret_key";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  logger.error("[Gateway-Redis] Erro de conexão", { error: err.message });
});

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "cliente" | "prestador";
  };
}

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1. Verifica assinatura JWT
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: "cliente" | "prestador";
    };

    // 2. Verifica blacklist no Redis
    const blacklisted = await redis.exists(`blacklist:token:${token}`);
    if (blacklisted) {
      res.status(401).json({ error: "Token inválido — sessão encerrada" });
      return;
    }

    req.user = decoded;

    // 3. Repassa dados do usuário para os serviços downstream
    req.headers["x-user-id"] = decoded.id;
    req.headers["x-user-email"] = decoded.email;
    req.headers["x-user-role"] = decoded.role;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expirado" });
      return;
    }
    res.status(401).json({ error: "Token inválido" });
  }
};
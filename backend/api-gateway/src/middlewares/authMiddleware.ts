import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "frella_secret_key";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "cliente" | "prestador";
  };
}

export const auth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: "cliente" | "prestador";
    };

    req.user = decoded;

    // Repassa dados do usuário para os serviços downstream via headers
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
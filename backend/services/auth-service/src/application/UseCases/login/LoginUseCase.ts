import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../../infrastructure/database/UserRepository";
import { logger } from "../../../infrastructure/logger";

export async function LoginUseCase(data: { email: string; password: string }) {
  logger.info('Tentativa de login', { email: data.email });

  const user = await UserRepository.findByEmail(data.email);
  if (!user) {
    logger.warn('Login falhou — usuário não encontrado', { email: data.email });
    throw new Error("Credenciais inválidas");
  }

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) {
    logger.warn('Login falhou — senha incorreta', { email: data.email });
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "frella_secret_key",
    { expiresIn: "7d" }
  );

  logger.info('Login realizado com sucesso', { userId: user.id, role: user.role });

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}
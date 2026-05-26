import bcrypt from "bcryptjs";
import { UserRepository } from "../../../infrastructure/database/UserRepository";
import { logger } from "../../../infrastructure/logger";

export async function RegisterUseCase(data: {
  email: string;
  password: string;
  role: "cliente" | "prestador";
}) {
  logger.info('Tentativa de registro', { email: data.email, role: data.role });

  const existing = await UserRepository.findByEmail(data.email);
  if (existing) {
    logger.warn('Registro falhou — e-mail já cadastrado', { email: data.email });
    throw new Error("Email já cadastrado");
  }

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await UserRepository.create({ ...data, password: hashed });

  logger.info('Usuário registrado com sucesso', { userId: user.id, role: user.role });

  return user;
}
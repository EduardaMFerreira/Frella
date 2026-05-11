import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../../infrastructure/database/UserRepository";

export async function LoginUseCase(data: { email: string; password: string }) {
  const user = await UserRepository.findByEmail(data.email);
  if (!user) throw new Error("Credenciais inválidas");

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new Error("Credenciais inválidas");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "frella_secret_key",
    { expiresIn: "7d" }
  );

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}
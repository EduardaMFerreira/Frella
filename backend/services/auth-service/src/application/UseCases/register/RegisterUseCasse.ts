import bcrypt from "bcryptjs";
import { UserRepository } from "../../../infrastructure/database/UserRepository";

export async function RegisterUseCase(data: {
  email: string;
  password: string;
  role: "cliente" | "prestador";
}) {
  const existing = await UserRepository.findByEmail(data.email);
  if (existing) throw new Error("Email já cadastrado");

  const hashed = await bcrypt.hash(data.password, 10);
  return UserRepository.create({ ...data, password: hashed });
}
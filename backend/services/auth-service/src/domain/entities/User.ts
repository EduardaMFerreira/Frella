export interface User {
  id: string;
  email: string;
  password: string;
  role: "cliente" | "prestador";
  created_at: Date;
}
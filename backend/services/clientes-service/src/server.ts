import express from "express";
import cors from "cors";
import clientesRoutes from "./routes/clientes.routes";

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS NA RAIZ
app.use("/", clientesRoutes);

app.listen(3001, () => {
  console.log("Clientes service rodando na porta 3001");
});
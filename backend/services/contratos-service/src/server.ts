import express from "express";
import cors from "cors";
import contratosRoutes from "./routes/contratos.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", contratosRoutes);

app.listen(3002, () => {
  console.log("Contratos service rodando na porta 3002");
});
import express from "express";
import cors from "cors";
import propostasRoutes from "./routes/propostas.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", propostasRoutes);

app.listen(3004, () => {
  console.log("Propostas service rodando na porta 3004");
});
import express from "express";
import cors from "cors";
import avaliacoesRoutes from "./routes/avaliacoes.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", avaliacoesRoutes);

app.listen(3005, () => {
  console.log("Avaliacoes service rodando na porta 3005");
});
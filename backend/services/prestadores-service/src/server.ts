import express from "express";
import cors from "cors";
import prestadoresRoutes from "./routes/prestadores.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", prestadoresRoutes);

app.listen(3003, () => {
  console.log("Prestadores service rodando na porta 3003");
});
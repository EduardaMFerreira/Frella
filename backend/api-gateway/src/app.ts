import express from "express";
import cors from "cors";
import morgan from "morgan";

import clientesRoutes from "./routes/clientes.routes";
import prestadoresRoutes from "./routes/prestadores.routes";
import contratosRoutes from "./routes/contratos.routes";
import propostasRoutes from "./routes/propostas.routes";
import avaliacoesRoutes from "./routes/avaliacoes.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "API Gateway funcionando" });
});


app.use("/api/v1/clientes", clientesRoutes);
app.use("/api/v1/prestadores", prestadoresRoutes);
app.use("/api/v1/contratos", contratosRoutes);
app.use("/api/v1/propostas", propostasRoutes);
app.use("/api/v1/avaliacoes", avaliacoesRoutes);

export default app;
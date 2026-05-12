import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prestadoresRoutes from "./routes/prestadores.routes";
import { runMigrations } from "./infrastructure/database/migrate";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", prestadoresRoutes);

const PORT = process.env.PORT || 3003;

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Prestadores service rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao executar migrations:", err);
    process.exit(1);
  });
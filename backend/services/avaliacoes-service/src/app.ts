import express from "express";
import cors from "cors";
import avaliacoesRoutes from "./routes/avaliacoes.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/avaliacoes", avaliacoesRoutes);

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import authRoutes from "./routes/auth.routes";
import { getReadinessStatus } from "./infrastructure/health/HealthService";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";
const routesPath = isProduction
  ? "/app/dist/routes/*.js"
  : "./src/routes/*.ts";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Service API",
      version: "1.0.0",
      description: "Microsservico de autenticacao",
    },
    servers: [{ url: "http://localhost:3006" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [routesPath],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);

// Liveness
app.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Readiness
app.get("/health/ready", async (req, res) => {
  const result = await getReadinessStatus();
  const statusCode = result.status === "ok" ? 200 : 503;
  res.status(statusCode).json(result);
});

// Health geral
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
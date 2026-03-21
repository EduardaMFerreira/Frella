import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Avaliações Service API",
      version: "1.0.0",
      description: "API de Avaliações",
    },
    servers: [
      {
        url: "http://localhost:3005",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Prestadores Service API",
      version: "1.0.0",
      description: "API de Prestadores",
    },
    servers: [
      {
        url: "http://localhost:3006",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
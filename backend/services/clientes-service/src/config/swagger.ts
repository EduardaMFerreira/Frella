import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clientes Service API",
      version: "1.0.0",
      description: "API de Clientes",
    },
    servers: [
      {
        url: "http://localhost:300X",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
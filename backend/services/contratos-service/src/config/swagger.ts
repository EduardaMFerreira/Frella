import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contratos Service API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3002",
      },
    ],
  },
  apis: ["**/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
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
    components: {
      schemas: {
        Avaliacao: {
          type: "object",
          required: ["nota", "cliente_id", "prestador_id"],
          properties: {
            nota: { type: "number", example: 5 },
            comentario: { type: "string", example: "Ótimo serviço!" },
            cliente_id: { type: "string", example: "434f2efd-601b-4700-8b2f-7d3056925828" },
            prestador_id: { type: "string", example: "ebee7354-3d40-49c4-9d4a-95fefece4f6c" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
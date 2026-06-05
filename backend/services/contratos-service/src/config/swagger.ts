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
    components: {
      schemas: {
        Contrato: {
          type: "object",
          required: ["cliente_id", "prestador_id", "descricao", "valor", "data_inicio", "data_fim"],
          properties: {
            cliente_id: { type: "string", example: "434f2efd-601b-4700-8b2f-7d3056925828" },
            prestador_id: { type: "string", example: "ebee7354-3d40-49c4-9d4a-95fefece4f6c" },
            descricao: { type: "string", example: "Troca de canos na cozinha" },
            valor: { type: "number", example: 500 },
            data_inicio: { type: "string", example: "2026-06-10" },
            data_fim: { type: "string", example: "2026-06-15" },
          },
        },
      },
    },
  },
  apis: ["**/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
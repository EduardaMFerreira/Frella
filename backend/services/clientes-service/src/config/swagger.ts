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
        url: "http://localhost:3001",
      },
    ],
    components: {
      schemas: {
        Cliente: {
          type: "object",
          required: ["nome", "email"],
          properties: {
            nome: { type: "string", example: "Maria Souza" },
            email: { type: "string", example: "maria@email.com" },
            telefone: { type: "string", example: "81988888888" },
            endereco: {
              type: "object",
              properties: {
                logradouro: { type: "string" },
                numero: { type: "string" },
                bairro: { type: "string" },
                cidade: { type: "string" },
                estado: { type: "string" },
                cep: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
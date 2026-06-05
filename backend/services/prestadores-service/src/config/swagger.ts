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
        url: "http://localhost:3003",
      },
    ],
    components: {
      schemas: {
        Prestador: {
          type: "object",
          required: ["nome", "email", "especialidades"],
          properties: {
            nome: { type: "string", example: "João Silva" },
            email: { type: "string", example: "joao@email.com" },
            telefone: { type: "string", example: "81999999999" },
            especialidades: { type: "array", items: { type: "string" }, example: ["encanamento"] },
            descricao: { type: "string" },
            valor_hora: { type: "number", example: 80 },
            endereco: {
              type: "object",
              properties: {
                logradouro: { type: "string" },
                numero: { type: "string" },
                bairro: { type: "string" },
                cidade: { type: "string" },
                estado: { type: "string" },
                cep: { type: "string" }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"],
};
export const swaggerSpec = swaggerJsdoc(options);
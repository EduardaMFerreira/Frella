import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gateway",
      version: "1.0.0",
      description: "Documentação da API do projeto",
    },
    servers: [
      {
        url: "http://localhost:3000",
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
          },
        },
        Cliente: {
          type: "object",
          required: ["nome", "email"],
          properties: {
            nome: { type: "string", example: "Maria Souza" },
            email: { type: "string", example: "maria@email.com" },
            telefone: { type: "string", example: "81988888888" },
          },
        },
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
        Proposta: {
          type: "object",
          required: ["titulo", "descricao", "valor", "cliente_id", "prestador_id"],
          properties: {
            titulo: { type: "string", example: "Conserto de encanamento" },
            descricao: { type: "string", example: "Troca de canos na cozinha" },
            valor: { type: "number", example: 500 },
            cliente_id: { type: "string", example: "434f2efd-601b-4700-8b2f-7d3056925828" },
            prestador_id: { type: "string", example: "ebee7354-3d40-49c4-9d4a-95fefece4f6c" },
          },
        },
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
});
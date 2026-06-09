"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Propostas Service",
        version: "1.0.0",
        description: `Serviço responsável pelo gerenciamento de propostas entre clientes e prestadores.

---
🔖 **Versão:** 1.0.0 | **Ambiente:** ${process.env.NODE_ENV || 'development'} | **Build:** ${new Date().toISOString().split('T')[0]}

📡 **WebSocket:** ws://localhost:3004 — conecte-se para receber notificações em tempo real

🏥 **Health:** [/health](http://localhost:3004/health) | 📊 **Version:** [/version](http://localhost:3004/version)`,
    },
    paths: {
        "/api/propostas": {
            get: {
                summary: "Listar propostas",
                description: "Retorna todas as propostas. Filtre por cliente_id ou prestador_id.",
                parameters: [
                    {
                        name: "cliente_id",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "Filtrar por ID do cliente",
                    },
                    {
                        name: "prestador_id",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "Filtrar por ID do prestador",
                    },
                ],
                responses: {
                    200: { description: "Lista de propostas retornada com sucesso" },
                    400: { description: "Erro na requisição" },
                },
            },
            post: {
                summary: "Criar proposta",
                description: "Cria uma nova proposta e publica evento no RabbitMQ",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["titulo", "descricao", "valor", "cliente_id", "prestador_id"],
                                properties: {
                                    titulo: { type: "string", example: "Conserto de encanamento" },
                                    descricao: { type: "string", example: "Troca de canos na cozinha" },
                                    valor: { type: "number", example: 500 },
                                    status: { type: "string", example: "CRIADA" },
                                    cliente_id: { type: "string", example: "uuid-do-cliente" },
                                    prestador_id: { type: "string", example: "uuid-do-prestador" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "Proposta criada com sucesso" },
                    400: { description: "Dados inválidos" },
                },
            },
        },
        "/api/propostas/{id}": {
            get: {
                summary: "Buscar proposta por ID",
                description: "Retorna uma proposta específica pelo ID — lê do Read Model (CQRS)",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "ID da proposta",
                    },
                ],
                responses: {
                    200: { description: "Proposta encontrada" },
                    404: { description: "Proposta não encontrada" },
                },
            },
            delete: {
                summary: "Remover proposta",
                description: "Remove uma proposta e publica evento no RabbitMQ",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "ID da proposta",
                    },
                ],
                responses: {
                    204: { description: "Proposta removida com sucesso" },
                    400: { description: "Erro ao remover proposta" },
                },
            },
        },
        "/api/propostas/{id}/aceitar": {
            put: {
                summary: "Aceitar proposta",
                description: "Aceita uma proposta, persiste no banco e publica evento proposta.aceita no RabbitMQ",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "ID da proposta",
                    },
                ],
                responses: {
                    200: { description: "Proposta aceita com sucesso" },
                    400: { description: "Proposta já aceita ou não encontrada" },
                },
            },
        },
    },
};
exports.default = swaggerDocument;

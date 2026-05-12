const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Propostas Service",
    version: "1.0.0",
  },
  paths: {
    "/api/propostas": {
      get: {
        summary: "Listar propostas",
        responses: {
          200: {
            description: "OK",
          },
        },
      },
    },
  },
};

export default swaggerDocument;
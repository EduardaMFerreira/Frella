import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("clientes-service funcionando");
});

app.listen(3001, () => {
  console.log("clientes-service rodando na porta 3001");
});
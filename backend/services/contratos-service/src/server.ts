import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("contratos-service funcionando");
});

app.listen(3002, () => {
  console.log("contratos-service rodando na porta 3002");
});
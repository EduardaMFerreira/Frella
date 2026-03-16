import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("avaliacoes-service funcionando");
});

app.listen(3005, () => {
  console.log("avaliacoes-service rodando na porta 3005");
});
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("prestadores-service funcionando");
});

app.listen(3003, () => {
  console.log("prestadores-service rodando na porta 3003");
});
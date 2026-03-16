import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("propostas-service funcionando");
});

app.listen(3004, () => {
  console.log("propostas-service rodando na porta 3004");
});
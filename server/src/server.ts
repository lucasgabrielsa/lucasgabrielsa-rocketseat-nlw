import express from "express";

const app = express();

app.get("/users", (request, response) => {
  console.log("Listagem de usuários");

  response.json([
    {
      nome: "lucas",
    },
    { nome: "thiago" },
    { nome: "daniel" },
  ]);
});

app.listen("3333");

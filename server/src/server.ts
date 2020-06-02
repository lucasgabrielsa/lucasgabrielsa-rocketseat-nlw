import express from "express";

const app = express();

app.use(express.json());

const users = [{ nome: "lucas" }, { nome: "thiago" }, { nome: "daniel" }];

app.get("/users", (request, response) => {
  const search = String(request.query.search);
  console.log("search", search);
  const filteredUsers = search
    ? users.filter((user) => user.nome.includes(search))
    : users;
  response.json(filteredUsers);
});

app.get("/users/:id", (request, response) => {
  const id = Number(request.params.id);
  const user = users[id];
  response.json(user);
});

app.post("/users", (req, res) => {
  const data = req.body;
  const user = {
    nome: data.name,
  };
  return res.json(user);
});

app.listen("3333");

const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const users = JSON.parse(fs.readFileSync("users.json", "utf8"));
let lastid = users.users.length > 0 ? Math.max(...users.users.map(u => u.id)) : 0;

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(3000, () => {
  console.log(`Express server started on http://localhost:3000`);
});
app.get("/users", (req, res) => {
  res.json(users);
});
app.get("/users/:id", (req, res) => {
  const user = users.users.find((u) => u.id === req.params.id * 1);
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});
app.post("/users", (req, res) => {
  const newUser = {
    id: ++lastid,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    university: req.body.university,
    Level: req.body.Level,
  };
  if (!newUser.name || !newUser.email || !newUser.age || !newUser.university || !newUser.Level) {
    return res.status(400).send("All fields are required");
  }
  if (users.users.find((u) => u.email === newUser.email)) {
    return res.status(400).send("Email already exists");
  }

  users.users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.status(201).json(newUser);
});

app.delete("/users/:id", (req, res) => {
  const userIndex = users.users.findIndex((u) => u.id === req.params.id * 1);
  if (userIndex === -1) return res.status(404).send("User not found");
  users.users.splice(userIndex, 1);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.status(204).send();
});
app.put("/users/:id", (req, res) => {
  const userIndex = users.users.findIndex((u) => u.id === req.params.id * 1);
  if (userIndex === -1) return res.status(404).send("User not found");
  const updatedUser = {
    ...users.users[userIndex],
    ...req.body,
  };
  if (users.users.find((u) => u.email === updatedUser.email)) {
    return res.status(400).send("Email already exists");
  }
  users.users[userIndex] = updatedUser;
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.json(updatedUser);
});
app.patch("/users/:id", (req, res) => {
  const userIndex = users.users.findIndex((u) => u.id === req.params.id * 1);
  if (userIndex === -1) return res.status(404).send("User not found");
  const updatedUser = {
    ...users.users[userIndex],
    ...req.body,
  };
  if (users.users.find((u) => u.email === updatedUser.email)) {
    return res.status(400).send("Email already exists");
  }
  
  users.users[userIndex] = updatedUser;
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.json(updatedUser);
});


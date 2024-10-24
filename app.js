// app.js
const express = require("express");
const app = express();
const port = 8000;
const userRoutes = require("./routes/userRoutes");

// Middleware para interpretar JSON
app.use(express.json());

// Usando a rota '/admin' para registrar usuários
app.use("/", userRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Escutando a porta ${port}`);
});

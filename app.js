// app.js
const express = require("express");
require("dotenv").config(); // Carrega as variáveis de ambiente

const app = express();
const port = process.env.PORT || 8000;
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// Middleware para interpretar JSON
app.use(express.json());

// Rotas
app.use("/", userRoutes);
app.use("/", authRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Escutando a porta ${port}`);
});

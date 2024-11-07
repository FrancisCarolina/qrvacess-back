// app.js
const express = require("express");
require("dotenv").config(); // Carrega as variáveis de ambiente

const cors = require('cors');

const app = express();

app.use(cors());
const port = process.env.PORT || 8000;
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const condutorRoutes = require("./routes/condutorRoutes");
const veiculoRoutes = require("./routes/veiculoRoutes");

// Middleware para interpretar JSON
app.use(express.json());

// Rotas
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", condutorRoutes);
app.use("/", veiculoRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Escutando a porta ${port}`);
});

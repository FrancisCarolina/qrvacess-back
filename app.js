// app.js
const express = require("express");
require("dotenv").config(); // Carrega as variáveis de ambiente

const cors = require('cors');

const app = express();

app.use(cors());
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const condutorRoutes = require("./routes/condutorRoutes");
const veiculoRoutes = require("./routes/veiculoRoutes");
const codigoRoutes = require("./routes/codigoRoutes");
const localRoutes = require("./routes/localRoutes");
const qrcodeRoutes = require("./routes/qrcodeRoutes");

// Middleware para interpretar JSON
app.use(express.json());

// Rotas
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", condutorRoutes);
app.use("/", veiculoRoutes);
app.use("/", codigoRoutes);
app.use("/", localRoutes);
app.use("/", qrcodeRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Escutando a porta ${port}`);
});

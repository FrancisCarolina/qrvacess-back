// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario.js");  // Importa o modelo do Sequelize
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).send("Preencha todos os campos.");
  }

  try {
    const user = await Usuario.findOne({ where: { login } });

    if (!user) {
      return res.status(401).send("Usuário ou senha incorretos.");
    }

    const passwordIsValid = bcrypt.compareSync(senha, user.senha);

    if (!passwordIsValid) {
      return res.status(401).send("Usuário ou senha incorretos.");
    }

    const token = jwt.sign({ id: user.id, login: user.login }, SECRET_KEY);

    res.status(200).json({ auth: true, token, id: user.id });

  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).send("Erro no servidor.");
  }
};

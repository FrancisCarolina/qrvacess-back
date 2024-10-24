// controllers/userController.js
const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.register = (req, res) => {
  const { login, senha, nome_local } = req.body;

  if (!login || !senha || !nome_local) {
    return res.status(400).send("Preencha todos os campos.");
  }

  // Criptografar a senha
  const hashedPassword = bcrypt.hashSync(senha, 10);

  // Inserir usuário no banco de dados
  const query =
    "INSERT INTO usuarios (login, senha, nome_local) VALUES (?, ?, ?)";
  db.query(query, [login, hashedPassword, nome_local], (err, result) => {
    if (err) {
      return res.status(500).send("Erro ao registrar usuário.");
    }
    res.status(201).send("Usuário registrado com sucesso!");
  });
};

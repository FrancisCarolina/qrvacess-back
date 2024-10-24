const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).send("Preencha todos os campos.");
  }

  // Verificar se o usuário existe no banco de dados
  const query = "SELECT * FROM usuarios WHERE login = ?";
  db.query(query, [login], (err, results) => {
    if (err) {
      return res.status(500).send("Erro no servidor.");
    }

    if (results.length === 0) {
      return res.status(401).send("Usuário ou senha incorretos.");
    }

    const user = results[0];

    // Comparar a senha enviada com a senha criptografada no banco
    const passwordIsValid = bcrypt.compareSync(senha, user.senha);

    if (!passwordIsValid) {
      return res.status(401).send("Usuário ou senha incorretos.");
    }

    // Gerar um token JWT (sem validade de expiração)
    const token = jwt.sign({ id: user.id, login: user.login }, SECRET_KEY, {
      // sem expiration (não define 'expiresIn')
    });

    // Retornar o token
    res.status(200).json({ auth: true, token });
  });
};

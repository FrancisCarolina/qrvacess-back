const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).send("Preencha todos os campos.");
  }

  try {
    const query = "SELECT * FROM usuarios WHERE login = ?";
    const [results] = await db.query(query, [login]);

    if (results.length === 0) {
      return res.status(401).send("Usuário ou senha incorretos.");
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(senha, user.senha);

    if (!passwordIsValid) {
      return res.status(401).send("Usuário ou senha incorretos.");
    }

    // Gerar um token JWT (com validade de expiração)
    const token = jwt.sign({ id: user.id, login: user.login }, SECRET_KEY);

    // Retornar o token e o id do usuário
    res.status(200).json({ auth: true, token, id: user.id });

  } catch (err) {
    console.error("Erro na consulta ao banco de dados:", err);
    res.status(500).send("Erro no servidor.");
  }
};

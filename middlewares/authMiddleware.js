require("dotenv").config(); // Carregar variáveis de ambiente

const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Nenhum token fornecido.");
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).send("Falha ao autenticar o token.");
    }

    req.userId = decoded.id;
    next();
  });
};

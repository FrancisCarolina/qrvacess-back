// controllers/userController.js
const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.register = async (req, res) => {
  const { login, senha, nome_local } = req.body;

  if (!login || !senha || !nome_local) {
    return res.status(400).send("Preencha todos os campos.");
  }

  try {
    const hashedPassword = bcrypt.hashSync(senha, 10);

    const localQuery = "SELECT id FROM local WHERE nome = ?";
    const [localResult] = await db.promise().query(localQuery, [nome_local]);

    let localId;

    if (localResult.length > 0) {
      localId = localResult[0].id;
    } else {
      const insertLocalQuery = "INSERT INTO local (nome) VALUES (?)";
      const [insertLocalResult] = await db.promise().query(insertLocalQuery, [nome_local]);
      localId = insertLocalResult.insertId;
    }

    const roleId = 1;

    const userQuery = "INSERT INTO usuarios (login, senha, role_id, local_id) VALUES (?, ?, ?, ?)";
    await db.promise().query(userQuery, [login, hashedPassword, roleId, localId]);

    res.status(201).send("Usuário registrado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao registrar usuário.");
  }
};

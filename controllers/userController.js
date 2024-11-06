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
    const [localResult] = await db.query(localQuery, [nome_local]);

    let localId;

    if (localResult.length > 0) {
      localId = localResult[0].id;
    } else {
      const insertLocalQuery = "INSERT INTO local (nome) VALUES (?)";
      const [insertLocalResult] = await db.query(insertLocalQuery, [nome_local]);
      localId = insertLocalResult.insertId;
    }

    const roleId = 1;

    const userQuery = "INSERT INTO usuarios (login, senha, role_id, local_id) VALUES (?, ?, ?, ?)";
    await db.query(userQuery, [login, hashedPassword, roleId, localId]);

    res.status(201).send("Usuário registrado com sucesso!");
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).send("Este Login já está em uso.");
    }
    console.error(err);
    res.status(500).send("Erro ao registrar usuário.");
  }
};

exports.registerCondutor = async (req, res) => {
  const { nome, cpf, local_id, login, senha } = req.body;

  if (!nome || !cpf || !local_id || !login || !senha) {
    return res.status(400).send("Preencha todos os campos.");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const ativo = login === cpf ? 1 : 0;

    const localQuery = "SELECT id FROM local WHERE id = ?";
    const [localResult] = await connection.query(localQuery, [local_id]);

    if (localResult.length === 0) {
      throw new Error("Local não encontrado.");
    }

    const hashedPassword = bcrypt.hashSync(senha, 10);

    const roleId = 2;

    const userQuery = "INSERT INTO usuarios (login, senha, role_id, local_id) VALUES (?, ?, ?, ?)";
    const [userResult] = await connection.query(userQuery, [login, hashedPassword, roleId, local_id]);

    const condutorQuery = "INSERT INTO condutor (nome, cpf, ativo, usuario_id) VALUES (?, ?, ?, ?)";
    await connection.query(condutorQuery, [nome, cpf, ativo, userResult.insertId]);

    await connection.commit();
    res.status(201).send("Condutor registrado com sucesso!");
  } catch (err) {
    await connection.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).send("Este Login já está em uso.");
    }
    console.error(err);
    res.status(500).send("Erro ao registrar condutor.");
  } finally {
    connection.release();
  }
};

exports.ativarCondutor = async (req, res) => {
  const { condutor_id } = req.body;

  if (!condutor_id) {
    return res.status(400).send("O campo condutor_id é obrigatório.");
  }

  try {
    const updateQuery = "UPDATE condutor SET ativo = 1 WHERE id = ?";
    const [result] = await db.query(updateQuery, [condutor_id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Condutor não encontrado.");
    }

    res.status(200).send("Condutor ativado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao ativar condutor.");
  }
};
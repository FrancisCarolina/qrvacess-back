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
      if (err.message.includes('login')) {
        return res.status(409).send("Este Login já está em uso.");
      }
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
      if (err.message.includes('login')) {
        return res.status(409).send("Este Login já está em uso.");
      } else if (err.message.includes('cpf')) {
        return res.status(409).send("Este CPF já está em uso.");
      }
    }
    console.error(err);
    res.status(500).send("Erro ao registrar condutor.");
  } finally {
    connection.release();
  }
};

exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        u.id, u.login, u.role_id, 
        JSON_OBJECT('id', l.id, 'nome', l.nome) AS local
      FROM usuarios u
      LEFT JOIN local l ON u.local_id = l.id
      WHERE u.id = ?
    `;

    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).send("Usuário não encontrado.");
    }

    const user = results[0];
    res.status(200).json(user);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).send("Erro no servidor.");
  }
};


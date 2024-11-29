const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Local = require("../models/Local");
const Condutor = require("../models/Condutor");

exports.register = async (req, res) => {
  const { login, senha, nome_local } = req.body;

  if (!login || !senha || !nome_local) {
    return res.status(400).send("Preencha todos os campos.");
  }

  try {
    const hashedPassword = bcrypt.hashSync(senha, 10);

    let local = await Local.findOne({ where: { nome: nome_local } });
    if (!local) {
      local = await Local.create({ nome: nome_local });
    }

    const roleId = 1;
    await Usuario.create({
      login,
      senha: hashedPassword,
      role_id: roleId,
      local_id: local.id,
    });

    res.status(201).send("Usuário registrado com sucesso!");
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
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

  const transaction = await Usuario.sequelize.transaction();
  try {
    const ativo = login === cpf ? 1 : 0;

    const local = await Local.findByPk(local_id);
    if (!local) {
      throw new Error("Local não encontrado.");
    }

    const hashedPassword = bcrypt.hashSync(senha, 10);
    const roleId = 2;

    // Verificar se o login já existe no banco de dados antes de tentar criar
    const existingLogin = await Usuario.findOne({ where: { login } });
    if (existingLogin) {
      return res.status(409).send("Este Login já está em uso.");
    }

    // Se o login não existir, prosseguir com a criação
    const usuario = await Usuario.create({
      login,
      senha: hashedPassword,
      role_id: roleId,
      local_id: local.id,
    }, { transaction });

    await Condutor.create({
      nome,
      cpf,
      ativo,
      usuario_id: usuario.id,
    }, { transaction });

    await transaction.commit();
    res.status(201).send("Condutor registrado com sucesso!");
  } catch (err) {
    await transaction.rollback();
    console.error(err);

    if (err.name === "SequelizeUniqueConstraintError") {
      if (err.errors[0].path === "cpf") {
        return res.status(409).send("Este CPF já está em uso.");
      }
    }

    res.status(500).send("Erro ao registrar condutor.");
  }
};



exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Usuario.findByPk(id, {
      include: {
        model: Local,
        attributes: ["id", "nome"],
      },
      attributes: ["id", "login", "role_id"],
    });

    if (!user) {
      return res.status(404).send("Usuário não encontrado.");
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).send("Erro no servidor.");
  }
};

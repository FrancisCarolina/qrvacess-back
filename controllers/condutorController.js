const Condutor = require("../models/Condutor");
const Usuario = require("../models/Usuario");
const Local = require("../models/Local");

exports.ativarCondutor = async (req, res) => {
  try {
    const { condutor_id } = req.body;

    if (!condutor_id) {
      return res.status(400).send("ID do condutor é obrigatório.");
    }

    const [affectedRows] = await Condutor.update(
      { ativo: true },
      { where: { id: condutor_id } }
    );

    if (affectedRows === 0) {
      return res.status(404).send("Condutor não encontrado.");
    }

    res.status(200).send("Condutor ativado com sucesso.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao ativar o condutor.");
  }
};

exports.getCondutoresByLocalId = async (req, res) => {
  const { id } = req.params;

  try {
    const condutores = await Condutor.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["id", "login"],
          include: {
            model: Local,
            attributes: ["id", "nome"],
            where: { id },
          },
        },
      ],
      attributes: ["id", "nome", "cpf", "ativo"],
    });

    if (condutores.length === 0) {
      return res.status(404).send("Nenhum condutor encontrado para o local especificado.");
    }

    res.status(200).json(condutores);
  } catch (err) {
    console.error("Erro ao buscar condutores:", err);
    res.status(500).send("Erro no servidor.");
  }
};

exports.getCondutorByUserId = async (req, res) => {
  const { id } = req.params; // O ID aqui é o usuario_id

  try {
      // Busca o condutor pelo usuario_id
      const condutor = await Condutor.findOne({ where: { usuario_id: id } });

      if (!condutor) {
          return res.status(404).json({ message: "Condutor não encontrado." });
      }

      res.status(200).json(condutor);
  } catch (error) {
      console.error("Erro ao buscar condutor:", error);
      res.status(500).json({ message: "Erro no servidor." });
  }
};
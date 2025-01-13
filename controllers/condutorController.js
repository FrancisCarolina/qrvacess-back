const Condutor = require("../models/Condutor");
const Usuario = require("../models/Usuario");
const Local = require("../models/Local");
const Veiculo = require("../models/Veiculo");

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
exports.updateCondutor = async (req, res) => {
  try {
    const { id } = req.params; // ID do condutor na URL
    const { nome, ativo } = req.body; // Campos a serem atualizados no corpo da requisição

    if (!id) {
      return res.status(400).send("ID do condutor é obrigatório.");
    }

    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (ativo !== undefined) updateData.ativo = ativo;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).send("Nenhum dado para atualizar foi fornecido.");
    }

    const [affectedRows] = await Condutor.update(updateData, {
      where: { id },
    });

    if (affectedRows === 0) {
      return res.status(404).send("Condutor não encontrado.");
    }

    res.status(200).send("Condutor atualizado com sucesso.");
  } catch (err) {
    console.error("Erro ao atualizar condutor:", err);
    res.status(500).send("Erro no servidor.");
  }
};
exports.mudarVeiculoEmUso = async (req, res) => {
  const { id } = req.params; // ID do condutor
  const { veiculo_em_uso } = req.body; // ID do veículo que está em uso

  if (!veiculo_em_uso) {
    return res.status(400).send("ID do veículo em uso é obrigatório.");
  }

  try {
    // Atualiza todos os veículos do condutor para em_uso = false
    await Condutor.update(
      { em_uso: false },
      { where: { id }, include: { model: Veiculo } }
    );

    // Atualiza o veículo especificado para em_uso = true
    const [affectedRows] = await Veiculo.update(
      { em_uso: true },
      { where: { id: veiculo_em_uso, condutor_id: id } }
    );

    if (affectedRows === 0) {
      return res.status(404).send("Veículo não encontrado ou não pertencente ao condutor.");
    }

    res.status(200).send("Veículo atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao mudar o veículo em uso:", error);
    res.status(500).send("Erro no servidor.");
  }
};

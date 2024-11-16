const Condutor = require("../models/Condutor");
const Usuario = require("../models/Usuario");
const Local = require("../models/Local");
const Codigo = require('../models/codigo');
const Veiculo = require('../models/Veiculo');
const bcrypt = require('bcryptjs');

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

exports.gerarCodigo = async (req, res) => {
  try {
    const { id } = req.params;
    const { veiculo_id } = req.body;

    const condutor = await Condutor.findByPk(id);
    if (!condutor) {
      return res.status(404).send("Condutor não encontrado.");
    }

    const veiculo = await Veiculo.findByPk(veiculo_id);
    if (!veiculo) {
      return res.status(404).send("Veículo não encontrado.");
    }

    if (veiculo.condutor_id !== condutor.id) {
      return res
        .status(403)
        .send("Veículo não pertence ao condutor especificado.");
    }

    const rawCodigo = `${condutor.cpf}:${veiculo.placa}`;

    const hashedCodigo = await bcrypt.hash(rawCodigo, 10);

    const novoCodigo = await Codigo.create({
      codigo: hashedCodigo,
      condutor_id: id,
    });

    res.status(201).json({
      message: "Código gerado com sucesso.",
      codigoId: novoCodigo.id,
    });
  } catch (error) {
    console.error("Erro ao gerar código:", error);
    res.status(500).send("Erro no servidor.");
  }
};

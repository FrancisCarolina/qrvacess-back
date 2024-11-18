const Codigo = require('../models/codigo');
const Veiculo = require('../models/Veiculo');
const Condutor = require("../models/Condutor");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

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

    const codigoExistente = await Codigo.findOne({
      where: {
        condutor_id: id,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Menos de 24 horas
        },
      },
    });

    if (codigoExistente) {
      return res.status(200).json({
        codigo: codigoExistente.codigo,
        codigoId: codigoExistente.id,
        message: "Código reutilizado.",
      });
    }

    const hashedCodigo = await bcrypt.hash(rawCodigo, 10);

    const novoCodigo = await Codigo.create({
      codigo: hashedCodigo,
      condutor_id: id,
    });

    res.status(201).json({
      codigo: hashedCodigo,
      codigoId: novoCodigo.id,
      message: "Novo código gerado.",
    });
  } catch (error) {
    console.error("Erro ao gerar código:", error);
    res.status(500).send("Erro no servidor.");
  }
};


exports.validarCodigo = async (req, res) => {
  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.status(400).send("O campo 'codigo' é obrigatório.");
    }

    const codigoExistente = await Codigo.findOne({ where: { codigo } });

    if (!codigoExistente) {
      return res.status(404).json({ message: "Código inválido ou não encontrado." });
    }

    res.status(200).json({ message: "Código válido." });
  } catch (error) {
    console.error("Erro ao validar código:", error);
    res.status(500).send("Erro no servidor.");
  }
};

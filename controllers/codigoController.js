const Codigo = require('../models/codigo');
const Veiculo = require('../models/Veiculo');
const Condutor = require("../models/Condutor");
const Historico = require("../models/Historico");
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

    // Busca o código na tabela 'Codigos'
    const codigoExistente = await Codigo.findOne({
      where: {
        codigo,
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0), // Data de hoje à meia-noite
          [Op.lt]: new Date().setHours(23, 59, 59, 999), // Último milissegundo do dia
        },
      },
      include: {
        model: Condutor,
        attributes: ["id"],
      },
    });

    if (!codigoExistente) {
      return res.status(404).json({ valid: 0 });
    }

    const condutorId = codigoExistente.condutor_id;

    // Busca todos os veículos do condutor
    const veiculos = await Veiculo.findAll({
      where: { condutor_id: condutorId },
    });

    // Encontra o veículo em_uso = true
    const veiculoEmUso = veiculos.find((veiculo) => veiculo.em_uso);

    if (!veiculoEmUso) {
      return res.status(404).send("Nenhum veículo em uso encontrado para este condutor.");
    }

    // Cria uma nova linha na tabela de historico
    const [historicoEntrada, created] = await Historico.findOrCreate({
      where: {
        veiculo_id: veiculoEmUso.id,
        data_saida: null, // Buscando um histórico sem data_saida (indicando que o veículo ainda está dentro)
      },
      defaults: {
        veiculo_id: veiculoEmUso.id,
        data_entrada: new Date(),
        data_saida: null,
      },
    });

    if (!created) {
      // Caso o histórico já exista (indicando que o veículo já entrou), atualiza a data_saida
      historicoEntrada.data_saida = new Date();
      await historicoEntrada.save();
    }

    res.status(200).json({ valid: 1 });
  } catch (error) {
    console.error("Erro ao validar código:", error);
    res.status(500).send("Erro no servidor.");
  }
};

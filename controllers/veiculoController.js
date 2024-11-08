// controllers/veiculoController.js
const Veiculo = require("../models/Veiculo");
const Condutor = require("../models/Condutor");

exports.createVeiculo = async (req, res) => {
  const { placa, modelo, marca, cor, ano, condutor_id } = req.body;

  if (!placa || !modelo || !marca || !cor || !ano || !condutor_id) {
    return res.status(400).send("Preencha todos os campos obrigatórios.");
  }

  try {
    const condutor = await Condutor.findByPk(condutor_id);

    if (!condutor) {
      return res.status(404).send("Condutor não encontrado.");
    }

    const veiculo = await Veiculo.create({
      placa,
      modelo,
      marca,
      cor,
      ano,
      condutor_id,
    });

    res.status(201).json(veiculo);
  } catch (err) {
    console.error("Erro ao criar veículo:", err);
    res.status(500).send("Erro ao criar veículo.");
  }
};
exports.getVeiculoByPlacaOuNome = async (req, res) => {
  const { nome, placa } = req.query;
  try {
    let veiculo;

    if (nome) {
      veiculo = await Veiculo.findOne({
        include: [
          {
            model: Condutor,
            where: { nome },
            attributes: [],
          },
        ],
        attributes: ["id", "placa", "modelo", "condutor_id"],
      });
    } else if (placa) {
      veiculo = await Veiculo.findOne({
        where: { placa },
        attributes: ["id", "placa", "modelo", "condutor_id"],
      });
    } else {
      return res.status(400).send("Por favor, forneça 'nome' ou 'placa' como parâmetro.");
    }

    if (!veiculo) {
      return res.status(404).send("Veículo não encontrado.");
    }

    res.status(200).json(veiculo);
  } catch (err) {
    console.error("Erro ao buscar veículo:", err);
    return res.status(500).send("Erro no servidor.");
  }
};

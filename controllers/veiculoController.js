// controllers/veiculoController.js
const Veiculo = require("../models/Veiculo");
const Condutor = require("../models/Condutor");
const Usuario = require("../models/Usuario");

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
exports.getVeiculosByCondutorId = async (req, res) => {
  const { id } = req.params;  // Pegando o ID do condutor da URL

  try {
    // Buscando todos os veículos que pertencem ao condutor com o ID fornecido
    const veiculos = await Veiculo.findAll({
      where: { condutor_id: id },  // Condição para buscar veículos com o condutor_id correspondente
      attributes: ["id", "placa", "modelo", "marca", "cor", "ano"],  // Atributos que queremos retornar
    });

    if (veiculos.length === 0) {
      return res.status(404).send("Nenhum veículo encontrado para este condutor.");
    }

    res.status(200).json(veiculos);
  } catch (err) {
    console.error("Erro ao buscar veículos do condutor:", err);
    return res.status(500).send("Erro ao buscar veículos do condutor.");
  }
};
exports.getVeiculosByLocal = async (req, res) => {
  const { local_id } = req.params; // Pegando o local_id da URL

  try {
    const veiculos = await Veiculo.findAll({
      include: [
        {
          model: Condutor,
          attributes: ["nome"], // Inclui o nome do condutor
          include: [
            {
              model: Usuario, // Assumindo que o modelo de usuário está corretamente associado
              where: { local_id }, // Filtra pelo local_id do usuário
              attributes: ["login"], // Inclui o login do usuário
            },
          ],
        },
      ],
      attributes: ["id", "placa", "modelo", "marca", "cor", "ano"], // Atributos do veículo que queremos retornar
    });

    if (veiculos.length === 0) {
      return res.status(404).send("Nenhum veículo encontrado para este local.");
    }

    res.status(200).json(veiculos);
  } catch (err) {
    console.error("Erro ao buscar veículos por local:", err);
    return res.status(500).send("Erro ao buscar veículos por local.");
  }
};
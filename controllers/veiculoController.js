// controllers/veiculoController.js
const Veiculo = require("../models/Veiculo");
const Condutor = require("../models/Condutor");
const Usuario = require("../models/Usuario");
const { Op } = require("sequelize");

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
  const { local_id } = req.params; // Pegando o local_id da URL
  const { busca } = req.query; // Pegando o parâmetro de busca

  if (!busca) {
    return res.status(400).send("Por favor, forneça o parâmetro 'busca'.");
  }

  try {
    const veiculosNome = await Veiculo.findAll({
      include: [
        {
          model: Condutor,
          required: true, // O condutor deve estar associado para ser considerado
          where: {
            [Op.or]: [
              { nome: { [Op.like]: `%${busca}%` } }, // Busca parcial no nome do condutor
            ],
          },
          attributes: ["nome"], // Retorna o nome do condutor
          include: [
            {
              model: Usuario,
              required: true, // O local deve ser associado para ser considerado
              where: { local_id },
              attributes: [], // Não retorna atributos do usuário
            },
          ],
        },
      ],
      attributes: ["id", "placa", "modelo", "marca", "cor", "ano"], // Atributos desejados do veículo
    });

    const veiculosPlaca = await Veiculo.findAll({
      include: [
        {
          model: Condutor,
          required: true, // O condutor deve estar associado para ser considerado
          attributes: ["nome"], // Retorna o nome do condutor
          include: [
            {
              model: Usuario,
              required: true, // O local deve ser associado para ser considerado
              where: { local_id },
              attributes: [], // Não retorna atributos do usuário
            },
          ],
        },
      ],
      where: {
        [Op.or]: [
          { placa: { [Op.like]: `%${busca}%` } }, // Busca parcial na placa
        ],
      },
      attributes: ["id", "placa", "modelo", "marca", "cor", "ano"], // Atributos desejados do veículo
    });

    const veiculosCombinados = [...veiculosPlaca, ...veiculosNome];
    const veiculos = veiculosCombinados.filter(
      (veiculo, index, self) =>
        self.findIndex((v) => v.id === veiculo.id) === index
    );

    if (veiculos.length === 0) {
      return res.status(404).send("Nenhum veículo encontrado para os critérios fornecidos.");
    }

    res.status(200).json(veiculos);
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
      attributes: ["id", "placa", "modelo", "marca", "cor", "ano", "em_uso"],  // Atributos que queremos retornar
    });

    if (veiculos.length === 0) {
      return res.status(404).send("Nenhum veículo encontrado para este condutor.");
    }

    res.status(200).json(veiculos);
  } catch (err) {
    console.error("Erro ao buscar veículos do condutor:", err);
    return res.status(500).send("Erro ao buscar veículos do condutor.");
  }
};exports.getVeiculosByLocal = async (req, res) => {
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

    // Filtrar veículos que possuem condutor associado
    const veiculosComCondutor = veiculos.filter(veiculo => veiculo.Condutor !== null);

    if (veiculosComCondutor.length === 0) {
      return res.status(404).send("Nenhum veículo com condutor encontrado para este local.");
    }

    res.status(200).json(veiculosComCondutor);
  } catch (err) {
    console.error("Erro ao buscar veículos por local:", err);
    return res.status(500).send("Erro ao buscar veículos por local.");
  }
};
exports.updateVeiculo = async (req, res) => {
  const { id } = req.params; // Pegando o ID do veículo da URL
  const { placa, modelo, marca, cor, ano, condutor_id } = req.body; // Dados enviados no corpo da requisição

  try {
    // Buscando o veículo pelo ID
    const veiculo = await Veiculo.findByPk(id);

    if (!veiculo) {
      return res.status(404).send("Veículo não encontrado.");
    }

    // Validando o condutor_id se fornecido
    if (condutor_id) {
      const condutor = await Condutor.findByPk(condutor_id);
      if (!condutor) {
        return res.status(404).send("Condutor não encontrado.");
      }
    }

    // Atualizando os dados do veículo
    await veiculo.update({
      placa: placa || veiculo.placa,
      modelo: modelo || veiculo.modelo,
      marca: marca || veiculo.marca,
      cor: cor || veiculo.cor,
      ano: ano || veiculo.ano,
      condutor_id: condutor_id || veiculo.condutor_id,
    });

    res.status(200).json({
      message: "Veículo atualizado com sucesso.",
      veiculo,
    });
  } catch (err) {
    console.error("Erro ao atualizar veículo:", err);
    return res.status(500).send("Erro ao atualizar veículo.");
  }
};
exports.getVeiculosById = async (req, res) => {
  const { id } = req.params; // Pegando o ID do veículo da URL

  try {
    // Buscando o veículo pelo ID
    const veiculo = await Veiculo.findByPk(id, {
      include: [
        {
          model: Condutor,
          attributes: ["nome", "id"], // Inclui atributos desejados do condutor
          include: [
            {
              model: Usuario,
              attributes: ["login", "local_id"], // Inclui atributos desejados do usuário
            },
          ],
        },
      ],
      attributes: ["id", "placa", "modelo", "marca", "cor", "ano", "em_uso"], // Atributos do veículo que queremos retornar
    });

    if (!veiculo) {
      return res.status(404).send("Veículo não encontrado.");
    }

    res.status(200).json(veiculo);
  } catch (err) {
    console.error("Erro ao buscar veículo pelo ID:", err);
    return res.status(500).send("Erro ao buscar veículo pelo ID.");
  }
};
exports.deleteVeiculo = async (req, res) => {
  const { id } = req.params; // Pegando o ID do veículo da URL

  try {
    // Buscando o veículo pelo ID
    const veiculo = await Veiculo.findByPk(id);

    if (!veiculo) {
      return res.status(404).send("Veículo não encontrado.");
    }

    // Realizando o soft delete
    await veiculo.destroy();

    res.status(200).json({
      message: "Veículo excluído com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao excluir veículo:", err);
    return res.status(500).send("Erro ao excluir veículo.");
  }
};

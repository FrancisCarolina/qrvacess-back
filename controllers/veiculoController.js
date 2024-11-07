const db = require("../config/db");

exports.createVeiculo = async (req, res) => {
  const { placa, modelo, marca, cor, ano, condutor_id } = req.body;

  if (!placa || !modelo || !marca || !cor || !ano || !condutor_id) {
    return res.status(400).send("Preencha todos os campos obrigatórios.");
  }

  try {
    const condutorQuery = "SELECT id FROM condutor WHERE id = ?";
    const [condutor] = await db.query(condutorQuery, [condutor_id]);

    if (condutor.length === 0) {
      return res.status(404).send("Condutor não encontrado.");
    }

    const query = `
      INSERT INTO veiculos (placa, modelo, marca, cor, ano, condutor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [placa, modelo, marca, cor, ano, condutor_id]);

    res.status(201).json({ id: result.insertId, placa, modelo, marca, cor, ano, condutor_id });
  } catch (err) {
    console.error("Erro ao criar veículo:", err);
    res.status(500).send("Erro ao criar veículo.");
  }
};
exports.getVeiculoByPlacaOuNome = async (req, res) => {
    const { nome, placa } = req.query;
  
    try {
      let query = "SELECT v.id, v.placa, v.modelo, v.condutor_id FROM veiculos v";
      let queryParams = [];
  
      if (nome) {
        query += " JOIN condutor c ON c.id = v.condutor_id WHERE c.nome = ?";
        queryParams.push(nome);
      } else if (placa) {
        query += " WHERE v.placa = ?";
        queryParams.push(placa);
      } else {
        return res.status(400).send("Por favor, forneça 'nome' ou 'placa' como parâmetro.");
      }
  
      const [results] = await db.query(query, queryParams);
  
      if (results.length === 0) {
        return res.status(404).send("Veículo não encontrado.");
      }
  
      const veiculo = results[0];
      return res.status(200).json({
        id: veiculo.id,
        placa: veiculo.placa,
        modelo: veiculo.modelo,
        condutor_id: veiculo.condutor_id
      });
  
    } catch (err) {
      console.error("Erro ao buscar veículo:", err);
      return res.status(500).send("Erro no servidor.");
    }
  };

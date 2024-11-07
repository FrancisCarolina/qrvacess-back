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

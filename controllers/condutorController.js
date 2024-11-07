const db = require("../config/db");

exports.ativarCondutor = async (req, res) => {
  try {
    const { condutor_id } = req.body;

    if (!condutor_id) {
      return res.status(400).send("ID do condutor é obrigatório.");
    }

    const updateQuery = "UPDATE condutor SET ativo = 1 WHERE id = ?";
    const [result] = await db.query(updateQuery, [condutor_id]);

    if (result.affectedRows === 0) {
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
    const query = `
      SELECT 
        c.id AS id, 
        c.nome AS nome, 
        c.cpf AS cpf, 
        c.ativo AS ativo,
        u.id AS usuario_id, 
        u.login AS login
      FROM condutor c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      INNER JOIN local l ON u.local_id = l.id
      WHERE l.id = ?
    `;

    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).send("Nenhum condutor encontrado para o local especificado.");
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Erro ao buscar condutores:", err);
    res.status(500).send("Erro no servidor.");
  }
};

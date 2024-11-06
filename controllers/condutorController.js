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

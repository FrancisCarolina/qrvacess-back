const Local = require('../models/Local'); // Importa o modelo Local

// Busca todos os locais
exports.getAllLocais = async (req, res) => {
  try {
    const locais = await Local.findAll(); // Busca todos os registros da tabela Local
    res.status(200).json(locais); // Retorna a lista de locais
  } catch (error) {
    console.error("Erro ao buscar locais:", error);
    res.status(500).send("Erro no servidor.");
  }
};

// Busca um local por ID
exports.getLocalById = async (req, res) => {
  try {
    const { id } = req.params;

    const local = await Local.findByPk(id); // Busca o local pelo ID

    if (!local) {
      return res.status(404).send("Local não encontrado.");
    }

    res.status(200).json(local); // Retorna os detalhes do local
  } catch (error) {
    console.error("Erro ao buscar local:", error);
    res.status(500).send("Erro no servidor.");
  }
};

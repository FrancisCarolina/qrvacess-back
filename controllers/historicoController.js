const Veiculo = require("../models/Veiculo");
const Condutor = require("../models/Condutor");
const Usuario = require("../models/Usuario");
const Historico = require("../models/Historico");
const Local = require("../models/Local");

exports.getHistoricoPorLocal = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Encontra o local, associando as tabelas necessárias
      const local = await Local.findOne({
        where: { id }, // id do local vindo da URL
        include: {
          model: Usuario,
          include: {
            model: Condutor,
            include: {
              model: Veiculo,
              include: {
                model: Historico,
                where: { data_saida: null }, // Filtra para mostrar apenas registros sem data_saida (indicando que o veículo está dentro)
                required: false, // Inclui histórico, mesmo se não houver um registro
              },
            },
          },
        },
      });
  
      if (!local) {
        return res.status(404).json({ message: "Local não encontrado." });
      }
  
      // Extrai o histórico dos veículos do condutor do usuário
      console.log("AQUI: ", local);
      
      const historicos = local.usuarios
        .map(usuario => usuario.condutor.veiculos)
        .flat()
        .map(veiculo => veiculo.historicos)
        .flat();
  
      if (historicos.length === 0) {
        return res.status(404).json({ message: "Nenhum histórico encontrado para este local." });
      }
  
      res.status(200).json(historicos);
    } catch (error) {
      console.error("Erro ao buscar histórico por local:", error);
      res.status(500).send("Erro no servidor.");
    }
  };
  
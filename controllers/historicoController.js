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
          attributes: [],
          include: {
            model: Condutor,
            attributes: ['nome', 'cpf', 'ativo'], // Seleciona apenas os atributos do Condutor
            include: {
              model: Veiculo,
              attributes: ['placa', 'modelo', 'marca'], // Seleciona apenas os atributos do Veículo
              include: {
                model: Historico, 
                attributes: ['data_entrada', 'data_saida'], // Seleciona apenas os atributos de Histórico
                required: false, // Inclui histórico, mesmo se não houver um registro
              },
            },
          },
        },
      });
      if (!local) {
        return res.status(404).json({ message: "Local não encontrado." });
      }
  
      // Filtra os veículos para exibir apenas os que possuem histórico
      const usuariosComHistorico = local.Usuarios.map(usuario => {
        if (usuario.Condutor) {
          const condutorComVeiculosComHistorico = usuario.Condutor.Veiculos.filter(veiculo => veiculo.Historicos.length > 0);
          // Só mantém o condutor se ele tiver veículos com histórico
          if (condutorComVeiculosComHistorico.length > 0) {
            usuario.Condutor.Veiculos = condutorComVeiculosComHistorico;
            return usuario;
          }
        }
        return null; // Retorna null se o condutor não tiver veículos com histórico
      }).filter(usuario => usuario !== null); // Remove os usuários sem veículos com histórico
  
      res.status(200).json(usuariosComHistorico);
    } catch (error) {
      console.error("Erro ao buscar histórico por local:", error);
      res.status(500).send("Erro no servidor.");
    }
  };
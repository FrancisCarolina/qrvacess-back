const Veiculo = require("../models/Veiculo");
const Condutor = require("../models/Condutor");
const Usuario = require("../models/Usuario");
const Historico = require("../models/Historico");
const Local = require("../models/Local");

exports.getHistoricoPorLocal = async (req, res) => {
    try {
        const { id } = req.params; // ID do local
        const { date, type, month, year } = req.query; // Parâmetros de consulta
    
        let whereClause = {};
    
        // Configurar o filtro com base no tipo
        if(!type){
            return res.status(400).json({ message: "O type é obrigatório para o relatório" });
        }
        if (type === 'daily') {
          if (!date) {
            return res.status(400).json({ message: "A data é obrigatória para o filtro diário." });
          }
          whereClause = {
            data_entrada: {
              [Op.gte]: new Date(date),
              [Op.lt]: new Date(new Date(date).setDate(new Date(date).getDate() + 1)), // Próximo dia
            },
          };
        } else if (type === 'weekly') {
          const startOfWeek = new Date(date); // Data selecionada como início da semana
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // Fim da semana
    
          whereClause = {
            data_entrada: {
              [Op.gte]: startOfWeek,
              [Op.lt]: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)), // Próximo dia após o fim da semana
            },
          };
        } else if (type === 'monthly') {
          if (!month || !year) {
            return res.status(400).json({ message: "Mês e ano são obrigatórios para o filtro mensal." });
          }
    
          const startOfMonth = new Date(`${year}-${month}-01`);
          const endOfMonth = new Date(new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)); // Próximo mês
    
          whereClause = {
            data_entrada: {
              [Op.gte]: startOfMonth,
              [Op.lt]: endOfMonth,
            },
          };
        }
    
        // Buscar dados no banco com os filtros
        const local = await Local.findOne({
          where: { id },
          include: {
            model: Usuario,
            attributes: [],
            include: {
              model: Condutor,
              attributes: ['nome', 'cpf', 'ativo'],
              include: {
                model: Veiculo,
                attributes: ['placa', 'modelo', 'marca'],
                include: {
                  model: Historico,
                  attributes: ['data_entrada', 'data_saida'],
                  where: whereClause,
                  required: false,
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
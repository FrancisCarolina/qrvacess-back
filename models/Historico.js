const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Veiculo = require("./Veiculo");

const Historico = sequelize.define(
  "Historico",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data_entrada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_saida: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    veiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Veiculo,
        key: "id",
      },
    },
  },
  {
    tableName: "historico",
    timestamps: true,
  }
);

// Relacionamento
Historico.belongsTo(Veiculo, { foreignKey: "veiculo_id" });
Veiculo.hasMany(Historico, { foreignKey: "veiculo_id" });

module.exports = Historico;

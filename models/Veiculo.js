const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Condutor = require("./Condutor");

const Veiculo = sequelize.define("Veiculo", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  condutor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Condutor,
      key: "id",
    },
  },
  em_uso: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: "veiculos",
  timestamps: true,
  paranoid: true, // Habilita o soft delete
  deletedAt: "deletedAt", // Coluna para marcar exclusões
});

Veiculo.belongsTo(Condutor, { foreignKey: "condutor_id" });
Condutor.hasMany(Veiculo, { foreignKey: "condutor_id" });

module.exports = Veiculo;

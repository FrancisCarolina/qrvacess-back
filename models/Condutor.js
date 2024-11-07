// models/Condutor.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Condutor = sequelize.define("Condutor", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "condutor",
  timestamps: true,
});

module.exports = Condutor;

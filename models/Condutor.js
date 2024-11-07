// models/Condutor.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Usuario = require("./Usuario");

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
    defaultValue: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: "id",
    },
  },
}, {
  tableName: "condutor",
  timestamps: true,
});

Condutor.belongsTo(Usuario, { foreignKey: "usuario_id" });
Usuario.hasOne(Condutor, { foreignKey: "usuario_id" });

module.exports = Condutor;

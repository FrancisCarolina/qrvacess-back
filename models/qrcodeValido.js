// models/qrcodeValido.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const qrcodeValido = sequelize.define("qrcodeValido", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  valido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Definido como 0 (false) por padrão
  },
}, {
  tableName: "qrcodevalido", // O nome da tabela no banco de dados
  timestamps: true, // Não usamos os campos `createdAt` e `updatedAt`
});

module.exports = qrcodeValido;

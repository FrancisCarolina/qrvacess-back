// models/Local.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Local = sequelize.define("Local", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "local",
  timestamps: true,
});

module.exports = Local;

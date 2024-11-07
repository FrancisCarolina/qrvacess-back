// models/Usuario.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Local = require("./Local");

const Usuario = sequelize.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  local_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Local,
      key: "id",
    },
  },
}, {
  tableName: "usuarios",
  timestamps: false,
});

Usuario.belongsTo(Local, { foreignKey: "local_id" });
Local.hasMany(Usuario, { foreignKey: "local_id" });

module.exports = Usuario;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Condutor = require("./Condutor");

const Codigo = sequelize.define(
  "Codigo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING,
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
  },
  {
    tableName: "codigos",
    timestamps: true,
  }
);

Codigo.belongsTo(Condutor, { foreignKey: "condutor_id" });
Condutor.hasMany(Codigo, { foreignKey: "condutor_id" });

module.exports = Codigo;

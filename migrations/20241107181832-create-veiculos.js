"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("veiculos", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      placa: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      modelo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      marca: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ano: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      condutor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "condutor", // Nome da tabela que a chave estrangeira referencia
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Define o que acontece com `condutor_id` quando o condutor for deletado
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("veiculos");
  },
};

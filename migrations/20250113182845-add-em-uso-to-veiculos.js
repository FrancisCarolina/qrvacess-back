"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("veiculos", "em_uso", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Define que o veículo não está em uso por padrão
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("veiculos", "em_uso");
  },
};

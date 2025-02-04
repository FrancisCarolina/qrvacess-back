"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("veiculos", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true, // Permite valores nulos (indica que não está deletado)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("veiculos", "deletedAt");
  },
};

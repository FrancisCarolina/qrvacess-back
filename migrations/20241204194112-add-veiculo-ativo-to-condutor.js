"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("condutor", "veiculo_ativo", {
      type: Sequelize.INTEGER,
      references: {
        model: "veiculos",  // Tabela que o campo faz referência
        key: "id",          // Coluna que é referenciada
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Se o veículo for deletado, o campo ficará NULL
      allowNull: true,      // O campo pode ser nulo
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("condutor", "veiculo_ativo");
  },
};

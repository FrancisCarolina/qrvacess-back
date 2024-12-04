"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Remover a coluna 'veiculo_ativo' da tabela 'condutor'
    await queryInterface.removeColumn("condutor", "veiculo_ativo");

    // 2. Adicionar a coluna 'ativo' na tabela 'veiculos'
    await queryInterface.addColumn("veiculos", "ativo", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,  // Valor padrão (não ativo)
      allowNull: false,     // Não pode ser nulo
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Caso queira desfazer a migration:
    
    // 1. Adicionar novamente a coluna 'veiculo_ativo' na tabela 'condutor'
    await queryInterface.addColumn("condutor", "veiculo_ativo", {
      type: Sequelize.INTEGER,
      references: {
        model: "veiculos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true,
    });

    // 2. Remover a coluna 'ativo' da tabela 'veiculos'
    await queryInterface.removeColumn("veiculos", "ativo");
  },
};

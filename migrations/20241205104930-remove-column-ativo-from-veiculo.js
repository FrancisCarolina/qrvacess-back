module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('veiculos', 'ativo');
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('veiculos', 'ativo', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true, // Altere conforme o valor padrão necessário
      });
  }
};

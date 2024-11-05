// migrations/TIMESTAMP-remove-nome-local-from-usuarios.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("usuarios", "nome_local");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("usuarios", "nome_local", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};

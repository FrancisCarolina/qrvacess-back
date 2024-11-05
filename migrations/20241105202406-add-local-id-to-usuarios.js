// migrations/TIMESTAMP-add-local-id-to-usuarios.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("usuarios", "local_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "local", // Nome da tabela referenciada
        key: "id",      // Coluna referenciada
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("usuarios", "local_id");
  },
};

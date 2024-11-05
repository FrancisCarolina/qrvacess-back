// migrations/TIMESTAMP-add-role-id-to-usuarios.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("usuarios", "role_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "role", // Nome da tabela referenciada
        key: "id",     // Coluna referenciada
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("usuarios", "role_id");
  },
};

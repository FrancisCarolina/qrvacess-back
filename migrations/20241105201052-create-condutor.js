// migrations/TIMESTAMP-create-condutor.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("condutor", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      ativo: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1, // 1 para ativo, 0 para inativo
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "usuarios", // Tabela referenciada
          key: "id",         // Coluna referenciada
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("condutor");
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('codigos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_criada: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      condutor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'condutor',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('codigos');
  },
};

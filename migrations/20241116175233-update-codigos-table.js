'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('codigos', 'data_criada');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('codigos', 'data_criada', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },
};

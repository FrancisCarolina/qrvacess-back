// migrations/xxxxxx-add-unique-constraint-to-login.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adiciona o UNIQUE constraint no campo 'login'
    await queryInterface.addConstraint('usuarios', {
      fields: ['login'],
      type: 'unique',
      name: 'unique_login_constraint', // Nome da constraint
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Caso precise reverter a migration, removemos a constraint
    await queryInterface.removeConstraint('usuarios', 'unique_login_constraint');
  }
};

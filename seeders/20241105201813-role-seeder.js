// seeders/TIMESTAMP-role-seeder.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("role", [
      { id: 1, papel: "admin", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, papel: "condutor", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("role", null, {});
  },
};

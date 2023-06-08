'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Modules', [
      {
        name: 'Authorization',
        description: 'All about Authorization',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Suppliers',
        description: 'All about Suppliers',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Components',
        description: 'All about Components',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Products',
        description: 'All about Products',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Modules', null, {});
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const airlinesRaw = require('./data/airlines.json');
    const airlines = airlinesRaw.map(airline => {
      return {
        ...airline,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('Airlines', airlines, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airlines', null, {});
  }
};

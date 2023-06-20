'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const schedulesRaw = require('./data/schedules.json');
    const schedules = schedulesRaw.map(schedules => {
      return {
        ...schedules,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('schedules', schedules, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('schedules', null, {});
  }
};

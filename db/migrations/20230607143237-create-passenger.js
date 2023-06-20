'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('passengers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      family_name: {
        type: Sequelize.STRING
      },
      birth: {
        type: Sequelize.DATE
      },
      nationality: {
        type: Sequelize.STRING
      },
      ktp: {
        type: Sequelize.STRING
      },
      passpor: {
        type: Sequelize.STRING
      },
      origin_country: {
        type: Sequelize.STRING
      },
      valid_until: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('passengers');
  }
};
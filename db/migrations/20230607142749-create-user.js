'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      telp: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      user_type: {
        type: Sequelize.STRING
      },
      isActivated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      profilePicture: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      otp_expired: {
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
    await queryInterface.dropTable('Users');
  }
};
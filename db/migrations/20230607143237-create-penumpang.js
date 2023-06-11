'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Penumpangs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.STRING
      },
      nama_keluarga: {
        type: Sequelize.STRING
      },
      tgl_lahir: {
        type: Sequelize.DATE
      },
      kewarganegaraan: {
        type: Sequelize.STRING
      },
      ktp: {
        type: Sequelize.STRING
      },
      passpor: {
        type: Sequelize.STRING
      },
      negara_asal: {
        type: Sequelize.STRING
      },
      berlaku_sampai: {
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
    await queryInterface.dropTable('Penumpangs');
  }
};
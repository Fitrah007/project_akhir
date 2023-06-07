'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Penerbangans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tgl_berangkat: {
        type: Sequelize.DATE
      },
      tgl_kembali: {
        type: Sequelize.DATE
      },
      type_class: {
        type: Sequelize.STRING
      },
      harga: {
        type: Sequelize.INTEGER
      },
      jam_berangkat: {
        type: Sequelize.INTEGER
      },
      jam_tiba: {
        type: Sequelize.INTEGER
      },
      id_bandara_asal: {
        type: Sequelize.INTEGER
      },
      id_bandara_tujuan: {
        type: Sequelize.INTEGER
      },
      id_pesawat: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Penerbangans');
  }
};
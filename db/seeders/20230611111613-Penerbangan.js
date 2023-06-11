'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Penerbangans', [
      {
        tgl_berangkat: new Date('2023-06-15'),
        tgl_kembali: new Date('2023-06-20'),
        type_class: 'Ekonomi',
        harga: 500000,
        jam_berangkat: 8,
        jam_tiba: 10,
        id_bandara_asal: 1,
        id_bandara_tujuan: 2,
        id_pesawat: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tgl_berangkat: new Date('2023-06-15'),
        tgl_kembali: new Date('2023-06-20'),
        type_class: 'Bisnis',
        harga: 1000000,
        jam_berangkat: 10,
        jam_tiba: 12,
        id_bandara_asal: 2,
        id_bandara_tujuan: 1,
        id_pesawat: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add other flight data if needed
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Penerbangans', null, {});
  }
};
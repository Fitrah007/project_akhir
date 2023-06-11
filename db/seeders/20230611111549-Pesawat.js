'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Pesawats', [
      {
        nama: 'Nama Pesawat 1',
        nomor_pesawat: '001',
        kapasitas: 200,
        id_maskapai: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Nama Pesawat 2',
        nomor_pesawat: '002',
        kapasitas: 150,
        id_maskapai: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tambahkan data pesawat lainnya jika diperlukan
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pesawats', null, {});
  }
};
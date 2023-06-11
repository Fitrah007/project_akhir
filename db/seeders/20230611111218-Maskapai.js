'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Maskapais', [
      {
        nama: 'Nama Maskapai 1',
        negara: 'Negara Maskapai 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Nama Maskapai 2',
        negara: 'Negara Maskapai 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tambahkan data maskapai lainnya jika diperlukan
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Maskapais', null, {});
  }
};
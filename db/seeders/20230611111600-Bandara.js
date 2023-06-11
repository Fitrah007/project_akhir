'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bandaras', [
      {
        nama: 'Nama Bandara 1',
        kota: 'Jakarta',
        negara: 'Negara Bandara 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Nama Bandara 2',
        kota: 'Bandung',
        negara: 'Negara Bandara 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tambahkan data bandara lainnya jika diperlukan
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bandaras', null, {});
  }
};
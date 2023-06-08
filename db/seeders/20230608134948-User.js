'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const hashedPasswordSuperadmin = await bcrypt.hashSync('superadmin123', saltRounds);
    const hashedPasswordAdmin = await bcrypt.hashSync('admin123', saltRounds);
    const hashedPasswordUser = await bcrypt.hashSync('user123', saltRounds);

    await queryInterface.bulkInsert('Users', [
      {
        nama: 'Superadmin',
        email: 'superadmin@mail.com',
        password: hashedPasswordSuperadmin,
        role_id: 1,
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Admin',
        email: 'admin@mail.com',
        password: hashedPasswordAdmin,
        role_id: 2,
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'User',
        email: 'user@mail.com',
        password: hashedPasswordUser,
        role_id: 3,
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

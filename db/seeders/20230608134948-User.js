'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const hashedPasswordSuperadmin = await bcrypt.hashSync('superadmin123', saltRounds);
    const hashedPasswordAdmin = await bcrypt.hashSync('admin123', saltRounds);
    const hashedPasswordUser = await bcrypt.hashSync('user123', saltRounds);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Superadmin',
        email: 'superadmin@mail.com',
        password: hashedPasswordSuperadmin,
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin',
        email: 'admin@mail.com',
        password: hashedPasswordAdmin,
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'User',
        email: 'user@mail.com',
        password: hashedPasswordUser,
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};

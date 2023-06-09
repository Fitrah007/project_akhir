'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticket_code: {
        type: Sequelize.STRING
      },
      order_date: {
        type: Sequelize.DATE
      },
      total_passenger: {
        type: Sequelize.INTEGER
      },
      total_price: {
        type: Sequelize.INTEGER
      },
      payment_status: {
        type: Sequelize.STRING,
        defaultValue: "Belum Bayar",
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      passenger_id: {
        type: Sequelize.INTEGER
      },
      flight_id: {
        type: Sequelize.INTEGER
      },
      return_flight_id: {
        type: Sequelize.INTEGER
      },
      is_roundtrip: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('tickets');
  }
};
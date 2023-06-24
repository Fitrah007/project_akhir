'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {

    static associate(models) {
      // define association here
      Ticket.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Ticket.belongsTo(models.Flight, {
        foreignKey: 'flight_id',
        as: 'flights',
      });
      Ticket.belongsTo(models.Flight, {
        foreignKey: 'return_flight_id',
        as: 'returnFlights',
      });
      Ticket.hasOne(models.Transaction, {
        foreignKey: 'ticket_code',
        sourceKey: 'ticket_code',
        as: 'transactions',
      });
      Ticket.belongsTo(models.Passenger, {
        foreignKey: 'passenger_id',
        as: 'passengers',
      });
    }
  }
  Ticket.init({
    ticket_code: DataTypes.STRING,
    order_date: DataTypes.DATE,
    total_passenger: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    payment_status: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    passenger_id: DataTypes.INTEGER,
    flight_id: DataTypes.INTEGER,
    return_flight_id: DataTypes.INTEGER,
    is_roundtrip: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets',
  });
  return Ticket;
};
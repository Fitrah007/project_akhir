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
        as: 'flight',
      });
      Ticket.hasOne(models.Transaction, {
        foreignKey: 'ticket_id',
        as: 'transaction',
      });
      Ticket.belongsToMany(models.Passenger, {
        through: 'TicketPassenger',
        foreignKey: 'ticket_id',
        as: 'passengers',
      });
    }
  }
  Ticket.init({
    ticket_code: DataTypes.STRING,
    order_date: DataTypes.DATE,
    total_passenger: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    passenger_id: DataTypes.INTEGER,
    flight_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};
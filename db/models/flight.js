'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {

    static associate(models) {
      //define association here
      Flight.belongsTo(models.Airport, {
        foreignKey: 'departure_airport_id',
        as: 'departureAirport',
      });
      Flight.belongsTo(models.Airport, {
        foreignKey: 'arrival_airport_id',
        as: 'arrivalAirport',
      });
      Flight.belongsTo(models.Airplane, {
        foreignKey: 'airplane_id',
        as: 'airplane',
      });
      Flight.belongsTo(models.Airline, {
        foreignKey: 'airline_id',
        as: 'airline',
      });
      Flight.hasMany(models.Schedule, {
        foreignKey: 'flight_number',
        sourceKey: 'flight_number',
        as: 'schedules',
      });
      Flight.belongsToMany(models.Ticket, {
        through: 'TicketFlight',
        foreignKey: 'flight_id',
        as: 'tickets',
      });
      Flight.belongsToMany(models.Ticket, {
        through: 'TicketFlight',
        foreignKey: 'return_flight_id',
        as: 'returnTickets',
      });
    }
  }
  Flight.init({
    flight_number: DataTypes.STRING,
    departure_airport_id: DataTypes.INTEGER,
    airplane_id: DataTypes.INTEGER,
    airline_id: DataTypes.INTEGER,
    arrival_airport_id: DataTypes.INTEGER,
    class: DataTypes.STRING,
    price: DataTypes.INTEGER,
    departure_terminal_name: DataTypes.STRING,
    arrival_terminal_name: DataTypes.STRING,
    flight_date: DataTypes.STRING,
    departure_time: DataTypes.STRING,
    arrival_time: DataTypes.STRING,
    flight_duration: DataTypes.INTEGER,
    departure_timestamp: DataTypes.INTEGER,
    arrival_timestamp: DataTypes.INTEGER,
    free_baggage: DataTypes.INTEGER,
    cabin_baggage: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
    available_passenger: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Flight',
    tableName: 'flights',
  });
  return Flight;
};
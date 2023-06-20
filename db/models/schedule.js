  'use strict';
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {

      static associate(models) {
        // define association here
        
        Schedule.belongsTo(models.Airport, {
          foreignKey: 'departure_airport',
          targetKey: 'iata_code',
          as: 'departureAirport',
        });

        Schedule.belongsTo(models.Airport, {
          foreignKey: 'arrival_airport',
          targetKey: 'iata_code',
          as: 'arrivalAirport',
        });

        Schedule.belongsTo(models.Airline, {
          foreignKey: 'airline_code',
          targetKey: 'iata_code',
          as: 'airline',
        });

        Schedule.belongsTo(models.Airplane, {
          foreignKey: 'airplane_code',
          targetKey: 'code',
          as: 'airplane',
        });

        Schedule.belongsTo(models.Flight, {
          foreignKey: 'flight_number',
          targetKey: 'flight_number',
          as: 'flight',
        });
      }
    }
    Schedule.init({
      departure_airport: DataTypes.STRING,
      arrival_airport: DataTypes.STRING,
      price: DataTypes.INTEGER,
      departure_terminal_name: DataTypes.STRING,
      arrival_terminal_name: DataTypes.STRING,
      flight_number: DataTypes.STRING,
      airline_code: DataTypes.STRING,
      airplane_code: DataTypes.STRING,
      free_baggage: DataTypes.INTEGER,
      cabin_baggage: DataTypes.INTEGER,
      flight_day: DataTypes.STRING,
      departure_base_timestamp: DataTypes.INTEGER,
      arrival_base_timestamp: DataTypes.INTEGER,
      class: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'Schedule',
      tableName: 'schedules',
    });
    return Schedule;
  };
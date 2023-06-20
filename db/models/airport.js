'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    static associate(models) {
      Airport.hasMany(models.Flight, {
        foreignKey: 'departure_airport_id',
        as: 'departureFlights',
      });

      Airport.hasMany(models.Flight, {
        foreignKey: 'arrival_airport_id',
        as: 'arrivalFlights',
      });

      Airport.hasMany(models.Schedule, {
        foreignKey: 'departure_airport',
        sourceKey: 'iata_code',
        as: 'departureSchedules',
      });

      Airport.hasMany(models.Schedule, {
        foreignKey: 'arrival_airport',
        sourceKey: 'iata_code',
        as: 'arrivalSchedules',
      });
    }
  }
  Airport.init({
    name: DataTypes.STRING,
    iata_code: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airport',
    tableName: 'airports',
  });
  return Airport;
};

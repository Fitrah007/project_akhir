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
  });
  return Airport;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airline extends Model {
    static associate(models) {
      // define association here
      Airline.hasMany(models.Airplane, {
        foreignKey: 'airline_code',
        sourceKey: 'iata_code',
        as: 'airplanes',
      });
    }
  }
  Airline.init({
    name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    iata_code: DataTypes.STRING,
    icon_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airline',
  });
  return Airline;
};
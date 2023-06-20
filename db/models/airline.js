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

      Airline.hasMany(models.Schedule, {
        foreignKey: 'airline_code',
        sourceKey: 'iata_code',
        as: 'schedules',
      });

      Airline.hasMany(models.Flight, {
        foreignKey: 'airline_id',
        as: 'flights',
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
    tableName: 'airlines',
  });
  return Airline;
};
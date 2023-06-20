'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    static associate(models) {
      // define association here
      Airplane.belongsTo(models.Airline, {
        foreignKey: 'airline_code',
        targetKey: 'iata_code',
        as: 'airline',
      });
      Airplane.hasMany(models.Flight, {
        foreignKey: 'airplane_id',
        as: 'flights',
      });
      Airplane.hasMany(models.Schedule, {
        foreignKey: 'airplane_code',
        sourceKey: 'code',
        as: 'schedules',
      });
    }
  }
  Airplane.init({
    model: DataTypes.STRING,
    code: DataTypes.STRING,
    airline_code: DataTypes.STRING,
    seat_layout: DataTypes.STRING,
    seat_pitch: DataTypes.STRING,
    seat_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airplane',
    tableName: 'airplanes',
  });
  return Airplane;
};
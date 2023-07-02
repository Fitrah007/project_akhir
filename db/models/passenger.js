'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {

    static associate(models) {
      // define association here
      Passenger.hasMany(models.Ticket, {
        foreignKey: 'passenger_id',
        as: 'tickets',
      });
    }
  }
  Passenger.init({
    passenger_type: DataTypes.STRING,
    title: DataTypes.STRING,
    name: DataTypes.STRING,
    family_name: DataTypes.STRING,
    birth: DataTypes.DATE,
    nationality: DataTypes.STRING,
    telp: DataTypes.STRING,
    passpor: DataTypes.STRING,
    origin_country: DataTypes.STRING,
    valid_until: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Passenger',
    tableName: 'passengers',
  });
  return Passenger;
};
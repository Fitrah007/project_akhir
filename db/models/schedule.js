  'use strict';
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {

      static associate(models) {
        // define association here
        Schedule.belongsTo(models.Flight, {
          foreignKey: 'flight_id',
          as: 'flight',
        });
      }
    }
    Schedule.init({
      flight_id: DataTypes.INTEGER,
      flight_day: DataTypes.STRING,
      departure_base_timestamp: DataTypes.INTEGER,
      arrival_base_timestamp: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: 'Schedule',
    });
    return Schedule;
  };
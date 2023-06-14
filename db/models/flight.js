'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
      Flight.hasMany(models.Schedule, {
        foreignKey: 'flight_id',
        as: 'schedules',
      });
    }
  }
  Flight.init({
    flight_number: DataTypes.STRING,
    departure_airport_id: DataTypes.INTEGER,
    arrival_airport_id: DataTypes.INTEGER,
    airplane_id: DataTypes.INTEGER,
    class: DataTypes.STRING,
    price: DataTypes.INTEGER,
    flight_date: DataTypes.STRING,
    departure_time: DataTypes.STRING,
    arrival_time: DataTypes.STRING,
    flight_duration: DataTypes.INTEGER,
    departure_timestamp: DataTypes.INTEGER,
    arrival_timestamp: DataTypes.INTEGER,
    free_baggage: DataTypes.INTEGER,
    cabin_baggage: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
    is_available: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};
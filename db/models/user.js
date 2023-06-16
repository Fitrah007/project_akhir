'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Ticket, {
        foreignKey: 'user_id',
        as: 'tickets',
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    telp: DataTypes.STRING,
    password: DataTypes.STRING,
    user_type: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    otp_expired: DataTypes.DATE,
    isActivated: DataTypes.BOOLEAN,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
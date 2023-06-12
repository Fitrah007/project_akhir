'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    telp: DataTypes.STRING,
    password: DataTypes.STRING,
    nama_keluarga: DataTypes.STRING,
    user_type: DataTypes.STRING,
    isActivated: DataTypes.BOOLEAN,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {

    static associate(models) {
      // Menentukan asosiasi dengan model User
      Notification.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    is_read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
  });
  return Notification;
};
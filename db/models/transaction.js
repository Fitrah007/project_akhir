'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {

    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Ticket, {
        foreignKey: 'ticket_id',
        as: 'ticket',
      });
    }
  }
  Transaction.init({
    ticket_id: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    payment_status: DataTypes.BOOLEAN,
    payment_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
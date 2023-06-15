'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {

    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Ticket, {
        foreignKey: 'ticket_code',
        targetKey: 'ticket_code',
        as: 'ticket',
      });
    }
  }
  Transaction.init({
    ticket_code: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payer_name: DataTypes.STRING,
    number_payment: DataTypes.STRING,
    payment_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {

    static associate(models) {
      // define association here
      // Pembayaran.belongsTo(models.Tiket, {
      //   foreignKey: 'id_tiket',
      //   as: 'tiket',
      // });
    }
  }
  Pembayaran.init({
    id_tiket: DataTypes.INTEGER,
    metode_pembayaran: DataTypes.STRING,
    status_pembayaran: DataTypes.BOOLEAN,
    tgl_pembayaran: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Pembayaran',
  });
  return Pembayaran;
};
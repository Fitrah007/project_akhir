'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
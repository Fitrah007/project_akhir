'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tiket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tiket.init({
    tgl_pesan: DataTypes.DATE,
    jmlh_penumpang: DataTypes.INTEGER,
    total_harga: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    id_penumpang: DataTypes.INTEGER,
    id_penerbangan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tiket',
  });
  return Tiket;
};
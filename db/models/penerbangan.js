'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penerbangan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Penerbangan.init({
    tgl_berangkat: DataTypes.DATE,
    tgl_kembali: DataTypes.DATE,
    type_class: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    jam_berangkat: DataTypes.INTEGER,
    jam_tiba: DataTypes.INTEGER,
    id_bandara_asal: DataTypes.INTEGER,
    id_bandara_tujuan: DataTypes.INTEGER,
    id_pesawat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Penerbangan',
  });
  return Penerbangan;
};
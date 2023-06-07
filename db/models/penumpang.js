'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penumpang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Penumpang.init({
    title: DataTypes.STRING,
    nama: DataTypes.STRING,
    nama_keluarga: DataTypes.STRING,
    tgl_lahir: DataTypes.DATE,
    kewarganegaraan: DataTypes.STRING,
    ktp: DataTypes.INTEGER,
    passpor: DataTypes.INTEGER,
    negara_asal: DataTypes.STRING,
    berlaku_sampai: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Penumpang',
  });
  return Penumpang;
};
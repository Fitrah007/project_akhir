'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penumpang extends Model {

    static associate(models) {
      // define association here
      Penumpang.belongsToMany(models.Tiket, {
        through: 'TiketPenumpang',
        foreignKey: 'penumpangId',
        otherKey: 'tiketId',
        as: 'tiket',
      });
    }
  }
  Penumpang.init({
    title: DataTypes.STRING,
    nama: DataTypes.STRING,
    nama_keluarga: DataTypes.STRING,
    tgl_lahir: DataTypes.DATE,
    kewarganegaraan: DataTypes.STRING,
    ktp: DataTypes.STRING,
    passpor: DataTypes.STRING,
    negara_asal: DataTypes.STRING,
    berlaku_sampai: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Penumpang',
  });
  return Penumpang;
};
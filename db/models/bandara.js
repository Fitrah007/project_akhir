'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bandara extends Model {
    static associate(models) {
      Bandara.hasMany(models.Penerbangan, {
        foreignKey: 'id_bandara_asal',
        as: 'bandara_asal',
      });
      Bandara.hasMany(models.Penerbangan, {
        foreignKey: 'id_bandara_tujuan',
        as: 'bandara_tujuan',
      });
    }
  }
  Bandara.init({
    nama: DataTypes.STRING,
    kota: DataTypes.STRING,
    negara: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bandara',
  });
  return Bandara;
};

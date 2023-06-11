'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Maskapai extends Model {

    static associate(models) {
      // define association here
      Maskapai.hasMany(models.Pesawat, {
        foreignKey: 'id_maskapai',
        as: 'pesawat',
      });
    }
  }
  Maskapai.init({
    nama: DataTypes.STRING,
    negara: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Maskapai',
  });
  return Maskapai;
};
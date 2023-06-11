'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pesawat extends Model {
    static associate(models) {
      // define association here
      Pesawat.belongsTo(models.Maskapai, {
        foreignKey: 'id_maskapai',
        as: 'maskapai',
      });
      Pesawat.hasMany(models.Penerbangan, {
        foreignKey: 'id_pesawat',
        as: 'penerbangan',
      });
    }
  }
  Pesawat.init({
    nama: DataTypes.STRING,
    nomor_pesawat: DataTypes.STRING,
    kapasitas: DataTypes.INTEGER,
    id_maskapai: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pesawat',
  });
  return Pesawat;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penerbangan extends Model {

    static associate(models) {
      // define association here
      Penerbangan.belongsTo(models.Bandara, {
        foreignKey: 'id_bandara_asal',
        as: 'bandara_asal',
      });
      Penerbangan.belongsTo(models.Bandara, {
        foreignKey: 'id_bandara_tujuan',
        as: 'bandara_tujuan',
      });
      Penerbangan.belongsTo(models.Pesawat, {
        foreignKey: 'id_pesawat',
        as: 'pesawat',
      });
      Penerbangan.hasMany(models.Tiket, {
        foreignKey: 'id_penerbangan',
        as: 'tiket',
      });
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
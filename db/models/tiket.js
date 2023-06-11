'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tiket extends Model {

    static associate(models) {
      // define association here
      Tiket.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'user',
      });
      Tiket.belongsToMany(models.Penumpang, {
        through: 'TiketPenumpang',
        foreignKey: 'tiketId',
        otherKey: 'penumpangId',
        as: 'penumpang',
      });
      Tiket.belongsTo(models.Penerbangan, {
        foreignKey: 'id_penerbangan',
        as: 'penerbangan',
      });
      Tiket.hasOne(models.Pembayaran, {
        foreignKey: 'id_tiket',
        as: 'pembayaran',
      });
    }
  }
  Tiket.init({
    kode_tiket: DataTypes.STRING,
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
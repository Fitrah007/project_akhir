'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pesawat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pesawat.init({
    nama: DataTypes.STRING,
    nomor_pesawat: DataTypes.INTEGER,
    kapasitas: DataTypes.INTEGER,
    id_maskapai: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pesawat',
  });
  return Pesawat;
};
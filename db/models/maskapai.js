'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Maskapai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
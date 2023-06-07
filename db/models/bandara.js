'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bandara extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
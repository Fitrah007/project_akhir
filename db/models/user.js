'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'role_id' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    telp: DataTypes.STRING,
    password: DataTypes.STRING,
    nama_keluarga: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    user_type: DataTypes.STRING,
    isActivated: DataTypes.BOOLEAN,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
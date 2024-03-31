const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Organization extends Model {}

Organization.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Organization',
});

module.exports = Organization;

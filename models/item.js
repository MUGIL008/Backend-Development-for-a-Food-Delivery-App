const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Item extends Model {}

Item.init({
  type: {
    type: DataTypes.ENUM('perishable', 'non-perishable'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Item',
});

module.exports = Item;

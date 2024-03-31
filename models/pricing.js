const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Organization = require('./organization');
const Item = require('./item');

class Pricing extends Model {}

Pricing.init({
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Organization,
      key: 'id',
    },
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Item,
      key: 'id',
    },
  },
  zone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  base_distance_in_km: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  km_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fix_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Pricing',
});

Organization.hasMany(Pricing, { foreignKey: 'organization_id' });
Item.hasMany(Pricing, { foreignKey: 'item_id' });
Pricing.belongsTo(Organization, { foreignKey: 'organization_id' });
Pricing.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = Pricing;

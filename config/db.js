const { Sequelize } = require('sequelize');

require('dotenv').config();

DATABASE_URL='postgres://postgres:password@localhost:5432/food_delivery'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  define: {
    timestamps: false, // Disable timestamps
  },
  logging: false, // Disable logging
});

module.exports = sequelize;

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: false
});

module.exports = sequelize;

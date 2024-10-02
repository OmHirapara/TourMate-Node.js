// guide.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');
const Guide = sequelize.define(
  'guide',
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    tourId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tours',
        key: 'id'
      }
    }
  },
  {
    tableName: 'guide'
  }
);

async function syncGuide() {
  try {
    await Guide.sync({ alter: true });
    console.log('Guide Model synced');
  } catch (error) {
    console.error('Error syncing Guide Model:', error);
  }
}
syncGuide();

module.exports = Guide;

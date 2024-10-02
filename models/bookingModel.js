// guide.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');
const Booking = sequelize.define(
  'booking',
  {
    tourId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tours',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    invoice_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invoice_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'booking'
  }
);

async function syncBooking() {
  try {
    await Booking.sync({ alter: true });
    console.log('Booking Model synced');
  } catch (error) {
    console.error('Error syncing Booking Model:', error);
  }
}
syncBooking();

module.exports = Booking;

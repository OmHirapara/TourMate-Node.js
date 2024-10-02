// models/associations.js

//!!! This Is Use For Test Only.This Is Use For Learning Perpose Only.

const User = require('./userModel');
const Tour = require('./tourModel');
const Review = require('./reviewModel');

// Associations
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Tour.hasMany(Review, { foreignKey: 'tourId' });
Review.belongsTo(Tour, { foreignKey: 'tourId' });
// Define the beforeFind hook
Review.addHook('beforeFind', options => {
  if (!options.include) {
    options.include = [];
  }

  options.include.push(
    {
      model: Tour
      //   attributes: []
    },
    {
      model: User,
      attributes: ['name', 'photo']
    }
  );
});

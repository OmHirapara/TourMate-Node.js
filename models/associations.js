// associations.js
const User = require('./userModel');
const Tour = require('./tourModel');
const Guide = require('./guidejunction');
const Review = require('./reviewModel');
const Booking = require('./bookingModel');

// Many-to-Many relationship between User and Tour through Guide
User.belongsToMany(Tour, {
  through: Guide // Assuming a junction table named 'Guide'
});

Tour.belongsToMany(User, {
  through: Guide, // Assuming a junction table named 'Guide'
  as: 'guides'
});

// Define the beforeFind hook
Tour.addHook('beforeFind', options => {
  if (!options.include) {
    options.include = [];
  }

  options.include.push({
    model: User,
    as: 'guides',
    through: { attributes: [] }, // Exclude junction table attributes
    attributes: ['id', 'role', 'name', 'photo'] // Specify user attributes to retrieve
  });
});

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

  options.include.push({
    model: User,
    attributes: ['name', 'photo']
  });
});

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Tour.hasMany(Booking, { foreignKey: 'tourId' });
Booking.belongsTo(Tour, { foreignKey: 'tourId' });

Booking.addHook('beforeFind', options => {
  if (!options.include) {
    options.include = [];
  }

  options.include.push =
    ({ model: User }, // Include User in the query
    { model: Tour, attributes: ['name'] }); // Include only the 'name' field of the Tour
});

// Export models
module.exports = { User, Tour, Guide, Review, Booking };

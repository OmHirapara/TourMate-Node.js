// review / rating / createdAt / ref to tour / ref to user
const sequelize = require('../sequelize.js');
const { DataTypes, Op, where, Sequelize } = require('sequelize');
const Tour = require('./tourModel.js');
const User = require('./userModel.js');

const Review = sequelize.define(
  'reviews',
  {
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Review can not be empty!'
        }
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [1],
          msg: 'Rating must be above 1.0'
        },
        max: {
          args: [5],
          msg: 'Rating must be below 5.0'
        }
      }
    },
    tourId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tours',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    tableName: 'reviews',
    indexes: [
      {
        name: 'tour_user_unique_index', // Optional, but helpful for identifying the index
        unique: true,
        fields: ['tourId', 'userId']
      }
    ]
  }
);

Review.prototype.calcAverageRatings = async function(tourId) {
  const result = await Review.findOne({
    where: { tourId },
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('rating')), 'nRating'],
      [
        Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('rating')), 1),
        'avgRating'
      ]
    ],
    group: ['tourId'],
    hooks: false
  });

  // Default to 0 ratings and 4.5 average if no reviews are found
  console.log('ssss', result);

  const stats = result ? result.dataValues : { nRating: 0, avgRating: 4.5 };

  await Tour.update(
    {
      ratings_quantity: stats.nRating,
      ratings_average: stats.avgRating
    },
    { where: { id: tourId } }
  );
};

Review.addHook('afterSave', function(review, options) {
  if (review.changed('rating')) {
    console.log('sdcasdasdasdasdadasd', review);
    review.calcAverageRatings(parseInt(review.tourId));
  }
});

Review.addHook('afterDestroy', async (review, options) => {
  await review.calcAverageRatings(parseInt(review.tourId));
});

async function syncTourModel() {
  try {
    await Review.sync({ alter: true });
    console.log('Reveiws Model synced');
  } catch (error) {
    console.error('Error syncing Tour Model:', error);
  }
}
// Call the function to execute the sync
syncTourModel();

module.exports = Review;

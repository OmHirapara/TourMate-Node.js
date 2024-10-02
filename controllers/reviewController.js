const sequelize = require('../sequelize');
const { Review, Tour, Booking } = require('../models/associations');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = null;
  if (req.params.tourId) filter = { tourId: req.params.tourId };

  const features = new APIFeatures(Review, req.query, filter)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.execute();
  // const reviews = await Review.findAll(filter);
  if (reviews.length === 0) return next(new AppError('No Data Found', 404));
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  if (req.body.tourId) req.body.tour = req.body.tourId;
  if (req.body.userId) req.body.user = req.body.userId;
  const id = await Review.findAll({
    order: [['id']]
  });
  const lastId = id.at(-1).id;
  const newReview = await Review.create({
    id: lastId + 1,
    review: req.body.review,
    rating: req.body.rating,
    tourId: req.body.tour,
    userId: req.body.user
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);

  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'review', 'rating');

  // 3) Update user Review
  const updateReview = await review.update(filteredBody, {
    returning: true,
    individualHooks: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      updateReview
    }
  });
});

exports.deleteReview = factory.deleteOne(Review);

exports.getAllReviewsOfUser = catchAsync(async (req, res, next) => {
  console.log('user', req.user.id);
  // const reviews = await Review.findAll({ where: { userId: req.user.id } });
  const booking = await Booking.findAll({
    where: { userId: req.user.id, paid: true },
    attributes: ['paid', 'id'],
    include: [
      {
        model: Tour,
        attributes: ['name', 'image_cover', 'start_dates']
      }
    ]
  });
  if (booking.length === 0) {
    return next(new AppError('No Booking And Review found for this user', 404));
  }
  const review = await Review.findAll({
    where: { userId: req.user.id },
    attributes: ['review', 'rating'],
    include: [
      {
        model: Tour,
        attributes: ['name', 'image_cover', 'start_dates']
      }
    ]
  });
  res.status(200).json({
    status: 'success',
    data: {
      review,
      booking
    }
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  const userId = 27;
  const [results, metadata] = await sequelize.query(
    `
    SELECT
	  	    t.id as tour_id,
          r.id AS review_id, 
          r.review, 
          r.rating,
          t.name AS tour_name, 
          t.image_cover, 
          t.start_dates
    FROM "tours" t 
	  INNER JOIN booking b ON b."tourId" = t.id AND b."userId" = :userId And b.paid = true
    LEFT JOIN "reviews" r ON r."tourId" = t.id AND r."userId" = :userId
	  Group BY  t.id ,r.id;
  `,
    {
      replacements: { userId }
      // type: sequelize.QueryTypes.SELECT
    }
  );
  // console.log('mata', results, metadata);
  if (results.length === 0) {
    return next(new AppError('There is no review with that name.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: results
  });
});

exports.getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

const catchAsync = require('../utils/catchAsync');
const sequelize = require('../sequelize');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');
const {
  Tour,
  User,
  Guide,
  Review,
  Booking
} = require('./../models/associations.js');


exports.getBilling = catchAsync(async (req, res, next) => {
  const allBooking = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    attributes: ['invoice_url', 'price'],
    include: [
      {
        model: Tour,
        attributes: ['name', 'start_dates', 'image_cover', 'slug']
      }
    ]
  });
  console.log('allBooking', allBooking.invoice_url, allBooking.tour);

  res.status(200).render('billing', {
    title: 'My Billing',
    booking: allBooking
  });
});
exports.getReview = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const [results, metadata] = await sequelize.query(
    `
    SELECT
	  	    t.id as tour_id,
          r.id AS review_id, 
          r.review, 
          r.rating,
          t.slug,
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
    }
  );
  console.log('res', results);

  res.status(200).render('review', {
    title: 'My Review',
    user: res.locals.user,
    review: results ? results : null
  });
});
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.findAll({
    order: ['id']
  });
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({
    where: { slug: req.params.slug },
    include: {
      model: Review,
      attributes: ['review', 'rating'],
      include: {
        model: User // Assuming you want to include specific fields from the User model
      }
    }
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  // console.log('clo', tour.guides);
  let user;
  if (res.locals.user || res.locals.user !== undefined) {
    user = res.locals.user;
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    user: user ? user : null
  });

  // 2) Build template
  // 3) Render template using data from 1)
});
exports.getResetPassword = async (req, res) => {
  res.status(200).render('passwordResetForm.ejs');
};
exports.forgotPassword = async (req, res) => {
  res.status(200).render('forgotPassword.ejs');
};
exports.getLoginForm = (req, res) => {
  if (res.locals.user) {
    return res.status(200).redirect('/');
  }
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupFrom = (req, res) => {
  if (res.locals.user) {
    return res.status(200).redirect('/');
  }
  res.status(200).render('signup', {
    title: 'Signup Into TourMate'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.findAll({ where: { userId: req.user.id } });
  // 2) Count occurrences of each tourId
  const tourCountMap = bookings.reduce((acc, booking) => {
    acc[booking.tourId] = (acc[booking.tourId] || 0) + 1;
    return acc;
  }, {});

  // 3) Get all unique tourIds
  const tourIDs = Object.keys(tourCountMap);
  const tours = await Tour.findAll({
    where: {
      id: {
        [Op.in]: tourIDs
      }
    }
  });
  // 5) Attach the count to each tour object
  const toursWithCount = tours.map(tour => ({
    ...tour.toJSON(), // convert Sequelize instance to plain object
    count: tourCountMap[tour.id] // attach the count of the tourId
  }));
  res.status(200).render('myBooking', {
    title: 'My Tours',
    tours: toursWithCount
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

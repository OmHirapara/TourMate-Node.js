const { Tour, User, Guide, Review } = require('./../models/associations.js');
const sharp = require('sharp');
const multer = require('multer');
const APIFeatures = require('./../utils/apiFeatures.js');
const { Op } = require('sequelize');
const factory = require('./handlerFactory');
const Sequelize = require('../sequelize.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { sequelize, fn, col, QueryTypes, literal, where } = require('sequelize');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'image_cover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  console.log('req', !req.files.image_cover);
  if (!req.files.images) return next();
  console.log('in Images');

  // 1) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
exports.resizeTourImage_Cover = catchAsync(async (req, res, next) => {
  console.log('req', !req.files.image_cover);
  if (!req.files.image_cover) return next();
  console.log('in Cover');

  // 1) Cover image
  req.body.image_cover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  console.log('image_cover', req.body.image_cover);

  const imageC = await sharp(req.files.image_cover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.image_cover}`);
  console.log('dssd', imageC);

  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings_average,price';
  req.query.fields = 'name,price,ratings_average,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  console.log(features);
  // Await The Query
  const tours = await features.execute();
  // Check Length

  if (!tours) {
    return next(new AppError('No Tour Found', 404));
  }
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Sequelize.query(
    `
      SELECT 
      difficulty AS difficulty,
        COUNT(*) AS numTours,
        SUM(ratings_quantity) AS num_ratings,
        ROUND(CAST(AVG(ratings_average) AS NUMERIC),1) AS avg_rating,
        ROUND(CAST(AVG(price) AS NUMERIC)) AS avg_price,
        MIN(price) AS min_price,
        MAX(price) AS max_price
      FROM tours
      WHERE ratings_average >= 4.5 AND secret_tour = false
      GROUP BY  difficulty
      ORDER BY avg_price DESC;
    `,
    {
      type: QueryTypes.SELECT
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Sequelize.query(
    `
      SELECT 
        COUNT(*) AS "num_tour_starts",
        array_agg(name) AS tours,
        EXTRACT(MONTH FROM date) AS month
      FROM (
        SELECT
          name,
          unnest("start_dates") AS date
        FROM "tours"
        WHERE secret_tour = false
      ) AS unnested
      WHERE date >= :start_date AND date <= :end_date 
      GROUP BY month
      ORDER BY "num_tour_starts" DESC
      LIMIT 12;
    `,
    {
      replacements: {
        start_date: `${year}-01-01`,
        end_date: `${year}-12-31`
      },
      type: QueryTypes.SELECT
    }
  );

  if (!plan) {
    return next(new AppError('No Tour Found with that Year', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
exports.createTour = catchAsync(async (req, res, next) => {
  const guideChecks = await Promise.all(
    req.body.guide_id.map(async id => {
      return await User.findOne({ where: { id: id } });
    })
  );
  console.log('gu', guideChecks);

  if (guideChecks.every(guide => guide !== null)) {
    const newTour = await Tour.create(req.body);
    await Promise.all(
      newTour.guide_id.map(async id => {
        await Guide.create({ userId: id, tourId: newTour.id });
      })
    );
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } else {
    return next(
      new AppError(
        'Guide ID Not Found, Please Check Guide Id Is Exist Or Not',
        404
      )
    );
  }
});

exports.updateTour = catchAsync(async (req, res, next) => {
  console.log('req', req.body);

  const tour = await Tour.findByPk(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  const userId = req.body.guide_id;
  if (userId) {
    await Guide.destroy({ where: { tourId: tour.id } });
    const guideChecks = await Promise.all(
      userId.map(async id => {
        return await User.findOne({ where: { id: id } });
      })
    );
    if (guideChecks.every(guide => guide !== null)) {
      userId.forEach(async id => {
        await Guide.create({ userId: id, tourId: tour.id });
      });
    } else {
      return next(
        new AppError(
          'Guide ID Not Found, Please Check Guide Id Is Exist Or Not',
          404
        )
      );
    }
  }
  const updateTour = await tour.update(req.body);
  // await Guide.destroy({where:{tourId:tour.id}})
  res.status(200).json({
    status: 'success',
    data: {
      updateTour
    }
  });
});

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByPk(req.params.id, {
    include: [
      {
        model: Review,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: User,
            attributes: ['name', 'photo']
          }
        ]
      }
    ]
  });
  // Tour.findOne({ id: req.params.id })

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  // console.log('as', lat, lng);
  const radius = 7;

  const tours = await Tour.findAll({
    where: fn(
      'ST_DWithin',
      col('start_location_geo'),
      fn('ST_SetSRID', fn('ST_MakePoint', lng, lat), 4326),
      radius
    )
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.621371 : 1;
  console.log('sdfcsfd', multiplier);

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  // Convert the input coordinates to float
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  const distances = await Tour.findAll({
    attributes: [
      'name',
      [
        fn(
          'ST_Distance',
          col('start_location_geo'),
          fn('ST_SetSRID', fn('ST_MakePoint', longitude, latitude), 4326)
        ),
        'distance'
      ]
    ],
    order: [literal('distance')]
  });

  // Format the distances correctly based on the unit
  const formattedDistances = distances.map(tour => ({
    name: tour.name,
    distance: tour.getDataValue('distance') * multiplier * 100 //* 0.621371 * 100 // Convert to miles or kilometers and format
  }));

  res.status(200).json({
    status: 'success',
    data: {
      data: formattedDistances
    }
  });
});

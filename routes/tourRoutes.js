const express = require('express');
const tourController = require('./../controllers/tourController');
const authentication = require('./../middleware/authentication');
const authorization = require('../middleware/authorization');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
router.get('/distances/:latlng/:unit', tourController.getDistances);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/tours-within/500/center/:latlng')
  .get(tourController.getToursWithin);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authentication.protect,
    authorization.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authentication.protect,
    authorization.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(
    authentication.protect,
    authorization.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.resizeTourImage_Cover,
    tourController.updateTour
  )
  .delete(
    authentication.protect,
    authorization.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;

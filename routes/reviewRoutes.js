const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authentication = require('./../middleware/authentication');
const authorization = require('../middleware/authorization');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authentication.protect,
    authorization.restrictTo('user'),
    reviewController.createReview
  );

router.use(authentication.protect);
router.route('/userreview').get(reviewController.getReviews);
router
  .route('/user')
  .get(authorization.restrictTo('user'), reviewController.getAllReviewsOfUser);

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .patch(
    authorization.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authorization.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;

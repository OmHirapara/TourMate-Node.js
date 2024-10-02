const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authentication = require('./../middleware/authentication');
const authorization = require('../middleware/authorization');

const router = express.Router();

router.use(authentication.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.get('/userBookings', bookingController.getAllBookingsById);

router.use(authorization.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  //   .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;

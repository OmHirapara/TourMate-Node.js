const express = require('express');
const viewsController = require('../controllers/viewsController');
const authenticateCli = require('../middleware/authentication-client');
const authenticate = require('../middleware/authentication');

const router = express.Router();

router.get('/forgotPassword', viewsController.forgotPassword);
router.get('/resetPassword/:token', viewsController.getResetPassword);
router.get('/', authenticateCli.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authenticateCli.isLoggedIn, viewsController.getTour);
router.get('/login', authenticateCli.isLoggedIn, viewsController.getLoginForm);
router.get(
  '/signup',
  authenticateCli.isLoggedIn,
  viewsController.getSignupFrom
);
router.get('/me', authenticate.protect, viewsController.getAccount);

router.get('/my-tours', authenticate.protect, viewsController.getMyTours);
router.get('/my-review', authenticate.protect, viewsController.getReview);
router.get('/my-billing', authenticate.protect, viewsController.getBilling);

module.exports = router;

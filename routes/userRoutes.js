const express = require('express');
const userController = require('./../controllers/userController');
const authentication = require('./../middleware/authentication');
const authController = require('./../controllers/authController');
const authorization = require('../middleware/authorization');
const checkLoginAttempts = require('./../middleware/check_login_attempts');

const router = express.Router();

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/conf/resetPassword/:token', authController.resetPassword);
router.post('/signup', authController.signup);
router.post('/login', checkLoginAttempts, authController.login);
router.get('/logout', authController.logout);
// router.get('/resetPassword/:token', authController.getResetPassword);

// Protect all routes after this middleware
router.use(authentication.protect);

router.get('/me', userController.getMe);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authorization.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser);
router.route('/block/:id').delete(userController.softDeleteUser);
router.route('/delete/:id').delete(userController.deleteUser);

module.exports = router;

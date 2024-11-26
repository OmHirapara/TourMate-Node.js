const express = require('express');
const authentication = require('./../middleware/authentication');
const guideController = require('./../controllers/guideController');
const authorization = require('../middleware/authorization');

const router = express.Router();

router.post('/create', guideController.signup);

router.use(authentication.protect);
router.use(authorization.restrictTo('admin'));

router.get('/', guideController.getAllGuide);

router.route('/:id').get(guideController.getGuideById);

router.route('/block/:id').delete(guideController.softDeleteUser);
router.route('/delete/:id').delete(guideController.deleteUser);

module.exports = router;

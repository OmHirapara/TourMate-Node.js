const { User } = require('./../models/associations');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const APIFeatures = require('../utils/apiFeatures');

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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Await The Query
  const users = await features.execute(false);
  users.forEach(user => {
    delete user.dataValues.password_confirm;
    delete user.dataValues.password_changed_at;
    delete user.dataValues.password_reset_token;
    delete user.dataValues.password_reset_expires;
    delete user.dataValues.failed_login_attempts;
    delete user.dataValues.blocked_until;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
  });
  // console.log('user', users);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new AppError('No User found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.password_confirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log('req', req.file);

  if (req.file) filteredBody.photo = req.file.filename;
  console.log('filter', filteredBody);

  // 3) Update user document
  const updatedUser = await User.update(filteredBody, {
    where: { id: req.user.id },
    returning: true,
    individualHooks: true
  });
  //  console.log('up',updatedUser[1]);
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser[1][0] // Sequelize returns an array, with the updated user being the second element
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.update(
    { active: false },
    {
      where: { id: req.user.id },
      individualHooks: true // Ensure any hooks are run if necessary
    }
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new AppError('No User found with that ID', 404));
  }
  delete user.dataValues.password_confirm;
  delete user.dataValues.password_changed_at;
  delete user.dataValues.password_reset_token;
  delete user.dataValues.password_reset_expires;
  delete user.dataValues.failed_login_attempts;
  delete user.dataValues.blocked_until;
  delete user.dataValues.createdAt;
  delete user.dataValues.updatedAt;
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Use Signup Route'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.deleteUser = factory.deleteOne(User);

exports.softDeleteUser = catchAsync(async (req, res, next) => {
  await User.update(
    { active: false },
    {
      where: { id: req.params.id },
      individualHooks: true // Ensure any hooks are run if necessary
    }
  );

  res.status(200).json({
    status: 'success',
    data: null
  });
});

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('./../models/associations');
const Userf = require('../models/userfunction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { Op } = require('sequelize');
const Email = require('./../utils/email');

exports.findByEmail = async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email.trim().toLowerCase() },
    hooks: false
  });
  console.log('user', user);
  res.status(201).json({
    status: 'success',
    data: user
  });
};

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = async (user, statusCode, res, req) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  user.password_confirm = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const id = await User.findAll({
    order: [['id']]
  });
  const lastId = id.at(-1).id;
  console.log('lastId', lastId);

  const newUser = await User.create({
    id: lastId + 1,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    password_confirm: req.body.password_confirm,
    password_changed_at: new Date(),
    role: req.body.role
  });
  const url = `${req.protocol}://${req.get('host')}/`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.scope('withPassword').findOne({
    where: { email: email.toLowerCase().trim() },
    hooks: false
  });

  if (!user || !(await user.correctPassword(password.trim(), user.password))) {
    user.failed_login_attempts += 1;

    console.log('failedattmpts', user.failed_login_attempts);

    if (user.failed_login_attempts >= 3) {
      user.blocked_until = new Date(Date.now() + 5 * 60 * 1000); // Block for 5 Minutes
    }
    await user.save();
    return next(new AppError('Incorrect email or password', 401));
  }

  // Reset failed login attempts on successful login
  if (user.active === false) user.active = true;
  user.failed_login_attempts = 0;
  user.blocked_until = null;
  await user.save();
  // console.log('user', user);

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'log-out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted email
  const user = await User.findOne({
    where: { email: req.body.email.toLowerCase().trim() }
  });
  if (!user) {
    return next(
      new AppError('Email Not Found Please Try Diffrent Email.', 404)
    );
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save();

  // 3) Send it to user's email
  try {
    //* For Real Appliction
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    console.log('Error', err);
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  console.log('req.params', req.params.token);
  if (!req.params.token || req.params.token === undefined) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    where: {
      password_reset_token: hashedToken,
      password_reset_expires: { [Op.gt]: Date.now() }
    }
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  const password = req.body.password.trim();
  const password_confirm = req.body.password_confirm.trim();

  // 3) Check if password and password_confirm match
  if (user.passwordMatch(password, password_confirm)) {
    return next(new AppError('Passwords do not match', 400));
  }

  // 4) Check The password validation
  if (!user.validatePassword(password)) {
    return next(
      new AppError(
        'Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number, and one special character',
        400
      )
    );
  }

  // 5) Set the new password
  user.password = password;
  user.password_reset_token = null;
  user.password_reset_expires = null;
  await user.save({ validate: false });
  console.log('user', user);

  // 6) Update changedPassword_at property for the user (This is change in userModel.js)

  res.status(201).json({
    status: 'success'
  });
  // 7) Log the user in, send JWT
  // createSendToken(user, 200, res);
});

exports.updatePassword = async (req, res, next) => {
  const { password_current, password, password_confirm } = req.body;

  // 1) Check if email and password exist
  if (!password_current || !password || !password_confirm) {
    return next(
      new AppError(
        'Please Provide CurrentPassword And Password And PasswordConfirm!',
        400
      )
    );
  }

  // 2) Check if user exists && password is correct
  const user = await User.scope('withPassword').findByPk(req.user.id);
  console.log('userid', user);

  if (
    !user ||
    !(await user.correctPassword(password_current.trim(), user.password))
  ) {
    return next(new AppError('Incorrect  password', 401));
  }

  // 3) Check if password and password_confirm match
  if (user.passwordMatch(password.trim(), password_confirm.trim())) {
    return next(new AppError('Passwords do not match', 400));
  }

  // 4) Check The password validation
  if (!user.validatePassword(password.trim())) {
    return next(
      new AppError(
        'Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number, and one special character',
        400
      )
    );
  }
  // 5) Update password
  user.password = password.trim();
  // user.password_confirm = password_confirm.trim();
  await user.save({ validate: false });
  // 6) Log the user in, send JWT
  createSendToken(user, 200, res);
};

const crypto = require('crypto');
const { promisify } = require('util');
// const Userf = require('../models/userfunction');
const jwt = require('jsonwebtoken');
const { User } = require('./../models/associations');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  console.log(token);
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  //! GRANT ACCESS TO PROTECTED ROUTE AND req.user is used in every were.
  //? MOST IMP  STEP
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

const {User} = require('./../models/associations');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const checkLoginAttempts = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({
    where: { email: email.toLowerCase().trim() },
    hooks:false
  });

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const now = new Date();

  if (user.blocked_until && now < user.blocked_until) {
    const block_time_remaining = Math.ceil((user.blocked_until - now) / 60000); // in minutes
    if (block_time_remaining + 0.0 <= 1.0) {
      user.failed_login_attempts = 0;
      user.blocked_until = null;
      await user.save();
      console.log('us', user);
    }
    return next(
      new AppError(
        `Account is blocked. Try again in ${block_time_remaining} minutes`,
        403
      )
    );
  }
  next();
});

module.exports = checkLoginAttempts;

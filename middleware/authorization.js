const AppError = require('./../utils/appError');
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    console.log('rere', req.user);
    if (
      req.user === undefined ||
      req.user.role === undefined ||
      !roles.includes(req.user.role)
    ) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

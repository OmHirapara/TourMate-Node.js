const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByPk(req.params.id, { hooks: false });

    if (!doc) {
      return next(new AppError('No Result Found With That ID', 404));
    }

    await doc.destroy();

    res.status(200).json({
      status: 'success',
      // message: 'Delete Success'
      data: null
    });
  });

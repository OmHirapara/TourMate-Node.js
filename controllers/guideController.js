const { User, Guide } = require('./../models/associations');
const Userf = require('../models/userfunction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sequelize = require('../sequelize');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');

exports.signup = catchAsync(async (req, res, next) => {
  const id = await User.findAll({
    order: [['id']]
  });
  const lastId = id.at(-1).id;
  console.log('lastId', lastId);

  const newGuide = await User.create({
    id: lastId + 1,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    password_confirm: req.body.password_confirm,
    password_changed_at: new Date(),
    role: 'guide'
  });

  // const url = `${req.protocol}://${req.get('host')}/`;
  // //   console.log(url);
  // await new Email(newGuide, url).sendWelcome();

  delete newGuide.dataValues.password;
  delete newGuide.dataValues.password_confirm;
  delete newGuide.dataValues.password_changed_at;
  delete newGuide.dataValues.updatedAt;
  delete newGuide.dataValues.createdAt;
  delete newGuide.dataValues.failed_login_attempts;
  delete newGuide.dataValues.password_reset_token;
  delete newGuide.dataValues.password_reset_expires;
  delete newGuide.dataValues.blocked_until;
  res.status(201).json({
    status: 'success',
    data: newGuide
  });
});

exports.getAllGuide = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Await The Query
  const guides = await features.execute(false);
  guides.forEach(guide => {
    delete guide.dataValues.password_confirm;
    delete guide.dataValues.password_changed_at;
    delete guide.dataValues.password_reset_token;
    delete guide.dataValues.password_reset_expires;
    delete guide.dataValues.failed_login_attempts;
    delete guide.dataValues.blocked_until;
    delete guide.dataValues.createdAt;
    delete guide.dataValues.updatedAt;
  });
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: guides.length,
    data: guides
  });
});

exports.getGuideById = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new AppError('No guide found with that ID', 404));
  }
  const guideId = req.params.id;
  const [results, metadata] = await sequelize.query(
    `
            SELECT 
                u.id AS guide_id,
                u.name AS guide_name,
                u.role AS guide_role,
                u.email AS guide_email,
                u.photo,
                u.active,
                g."tourId" AS tour_id,
                t.name AS tour_name,
                t.start_dates
            FROM 
                users u
            LEFT JOIN 
                guide g ON u.id = g."userId"
            LEFT JOIN 
                tours t ON g."tourId" = t.id
            WHERE 
                u.role = 'guide'
            And u.id = :guideId
  `,
    {
      replacements: { guideId }
    }
  );
  res.status(200).json({
    status: 'success',
    data: results
  });
});

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

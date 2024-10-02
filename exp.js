// const reviews = await Review.findAll({
//   attributes: ['id', 'review', 'rating'],
//   where: {
//     userId: userId,
//     tourId: {
//       [Sequelize.Op.in]: Sequelize.literal(`(
//         SELECT "tourId" FROM "booking" WHERE "userId" = ${userId}
//       )`)
//     }
//   },
//   include: [
//     {
//       model: Tour,
//       as: 'tour',
//       attributes: ['name', 'image_cover', 'start_dates']
//     }
//   ],
//   hooks: false
// });

//! For Embedding Model
// guides: {
//     type: DataTypes.ARRAY(DataTypes.JSON)
//   }
// // Hooks For The Guides
// Tour.addHook('beforeSave', async (tour, options) => {
//     const guidesPromises = tour.guides.map(async id => await User.findByPk(id));
//     guides = await Promise.all(guidesPromises);
//     guides.forEach((data,index) =>{
//       tour.guides[index]=data.dataValues
//     })
//   });

// const sequelize = require('../sequelize.js');
// const { DataTypes, Op, where } = require('sequelize');
// const slugify = require('slugify');

// const { now } = require("sequelize/lib/utils");

// // const validator = require('validator');
console.log(new Date());

// const Tour = sequelize.define(
//   'tour',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: {
//         args: true,
//         msg: 'A tour must have a unique name'
//       },
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a name'
//         },
//         len: {
//           args: [10, 40],
//           msg: 'A tour name must have between 10 and 40 characters'
//         }
//       },
//       set(value) {
//         console.log('Setter invoked with value:', value);
//         this.setDataValue('name', value.trim());
//       }
//     },
//     slug: {
//       type: DataTypes.STRING
//     },
//     duration: {
//       type: DataTypes.INTEGER, // Use INTEGER for numeric values
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a duration'
//         }
//       }
//     },
//     maxgroup_size: {
//       type: DataTypes.INTEGER,
//       default: 10,
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a group size'
//         }
//       }
//     },
//     difficulty: {
//       type: DataTypes.ENUM,
//       values: ['easy', 'medium', 'difficult'],
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a difficulty'
//         },
//         isIn: {
//           args: [['easy', 'medium', 'difficult']],
//           msg: 'Difficulty is either: easy, medium, difficult'
//         }
//       }
//     },
//     ratings_average: {
//       type: DataTypes.FLOAT,
//       defaultValue: 4.5,
//       validate: {
//         min: {
//           args: [1],
//           msg: 'Rating must be above 1.0'
//         },
//         max: {
//           args: [5],
//           msg: 'Rating must be below 5.0'
//         }
//       }
//     },
//     ratings_quantity: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0
//     },
//     price: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a price'
//         }
//       }
//     },
//     price_discount: {
//       type: DataTypes.FLOAT,
//       validate: {
//         isValidDiscount(value) {
//           if (value >= this.price) {
//             throw new Error('Discount price should be below regular price');
//           }
//         }
//       }
//     },
//     summary: {
//       type: DataTypes.STRING,
//       set(value) {
//         // Custom setter to trim whitespace from the beginning and end
//         this.setDataValue('summary', value.trim());
//       },
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a description'
//         }
//       }
//     },
//     description: {
//       type: DataTypes.STRING(1000),
//       set(value) {
//         console.log('Setter invoked with value:', value);
//         this.setDataValue('description', value.trim());
//       }
//     },
//     image_cover: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a cover image'
//         }
//       }
//     },
//     images: {
//       type: DataTypes.ARRAY(DataTypes.STRING)
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: Date.now(),
//       allowNull: false,
//       select: false
//     },
//     start_dates: {
//       type: DataTypes.ARRAY(DataTypes.DATE)
//     },
//     secret_tour: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     }
//   },
//   {
//     tableName: 'tour',
//     defaultScope: {
//       where: {
//         secret_tour: false
//       },
//       attributes: { exclude: ['createdAt'] }
//     }
//   }
// );

// // Virtual property example (not exactly as in Mongoose)
// Tour.prototype.toJSON = function() {
//   const values = Object.assign({}, this.get());
//   values.duration_weeks = this.duration / 7;
//   return values;
// };

// // Hooks example
// Tour.addHook('beforeSave', async (tour, options) => {
//   if (tour.name) {
//     tour.slug = slugify(tour.name, { lower: true });
//   }
// });

// // Pre-find hook example
// Tour.addHook('beforeFind', async options => {
//   if (!options.where) options.where = {};
//   options.where.secret_tour = { [Op.ne]: true };
//   options.startTime = Date.now();
// });
// Tour.addHook('beforeFind', options => {
//   if (options.where) {
//     options.where = {
//       [Op.and]: [{ secretTour: { [Op.ne]: true } }, options.where]
//     };
//   } else {
//     options.where = { secretTour: { [Op.ne]: true } };
//   }

//   console.log('Query options:', JSON.stringify(options, null, 2));
// });

// // Post-find hook example
// Tour.addHook('afterFind', async (result, options) => {
//   if (options.startTime) {
//     console.log(`Query took ${Date.now() - options.startTime} milliseconds!`);
//   }
// });

// // Aggregation middleware example (not exactly as in MongoDB)

// // Tour.addHook('beforeFind', (options) => {
// //   if (options && options.where) {
// //     options.where.secretTour = { [Op.ne]: true };
// //   } else {
// //     options.where = { secretTour: { [Op.ne]: true } };
// //   }
// //   console.log('Query options:', options);
// // });

// // Tour.addHook('beforeAggregate', async options => {
// //   console.log('pipe', options);

// //   // if (options && options.pipeline) {
// //   //   options.pipeline.unshift({
// //   //     $match: { secretTour: { [sequelize.Op.ne]: true } }
// //   //   });
// //   //   console.log('Aggregation pipeline:', options.pipeline);
// //   // }
// // });
// async function syncUserModel() {
//   try {
//     await Tour.sync({ alter: true });
//     console.log('User Model synced');
//   } catch (error) {
//     console.error('Error syncing User Model:', error);
//   }
// }

// // Call the function to execute the sync
// syncUserModel();

// module.exports = Tour;

// /////////////////

// /////////////////////////////////////////////////////?
// const s = { duration: { $gt: '5' }, difficulty: 'easy' };
// const field = { fields: 'name,   password  ,    phonenumber   ' };
// console.log(field.fields);
// console.log(field.split(',').map(field => field.trim()));

// // const objectList = [s];
// // console.log(
// //   objectList.find(d => {
// //     return d.duration.gte;
// //   })
// // );

// // function findNameById(list) {
// //   return list.find(obj => (obj.duration == 'gte') | 'ge' | 'lte' | 'le');
// // }
// const Op = 'OOp';
// // console.log(findNameById(objectList));
// const sequelizeFormattedQuery = {};
// for (let key in s) {
//   console.log(s[key]['$gt'] | ['$gte']);
// }
// //   if(s[key]["$gte"]){
// //     console.log('in');
// //   }
// //   console.log('keey', key);
// //   sequelizeFormattedQuery[key] = {};
// //   for (let op in s[key]) {
// //     console.log('op', op, 'key', key);
// //     console.log('be', sequelizeFormattedQuery[key]);
// //     sequelizeFormattedQuery[key][Op[op.replace('$', '')]] = s[key][op];
// //     // console.log('s', s[key][op]);
// //     console.log('af', sequelizeFormattedQuery[key][op]);
// //   }
// // }
// // console.log('last', sequelizeFormattedQuery);

// // exports.getAllTours = async (req, res) => {
// //   try {
// //     // EXECUTE QUERY
// //     const sort = req.query.sort;
// //     const searchCriteria = req.query;
// //     const excludeFields = ['page', 'sort', 'limit', 'fields'];
// //     excludeFields.forEach(el => delete searchCriteria[el]);
// //     const { duration, difficulty } = searchCriteria;
// //     const whereClause = {};
// //     if (duration) {
// //       whereClause.duration = {};
// //       if (duration.max || duration.min) {
// //         if (duration.max) {
// //           whereClause.duration[Op.gte] = duration.max;
// //         }
// //         if (duration.min) {
// //           whereClause.duration[Op.lte] = duration.min;
// //         }
// //       } else {
// //         whereClause.duration = duration;
// //       }
// //     }
// //     if (difficulty) {
// //       whereClause.difficulty = difficulty;
// //     }
// //     // Build the order clause dynamically
// //     let orderClause = [['createdAt', 'DESC']]; // Default sorting
// //     if (sort) {
// //       console.log('in');
// //       const sortBy = sort.split(',').map(field => field.trim());
// //       orderClause = sortBy.map(field => {
// //         const sortOrder = field.startsWith('-') ? 'DESC' : 'ASC';
// //         const fieldName = field.replace(/^-/, '');
// //         return [fieldName, sortOrder];
// //       });
// //     }
// //     const query = Tour.findAll({
// //       where: whereClause,
// //       order: orderClause
// //     });
// //     const tours = await query;
// //     if (tours.length == 0) {
// //       return res.status(404).json({ status: 'Tour Not Found' });
// //     }
// //     // SEND RESPONSE
// //     res.status(200).json({
// //       status: 'success',
// //       results: tours.length,
// //       data: {
// //         tours
// //       }
// //     });
// //   } catch (err) {
// //     res.status(404).json({
// //       status: 'fail',
// //       message: err
// //     });
// //   }
// // };
// // ? For All
// // exports.getAllTours = async (req, res) => {
// //   try {
// //     // EXECUTE QUERY
// //     const sort = req.query.sort;
// //     const fields = req.query.fields;
// //     const page = req.query.page;
// //     const limit = req.query.limit;
// //     const queryObj = req.query;
// //     const excludeFields = ['page', 'sort', 'limit', 'fields'];
// //     excludeFields.forEach(el => delete queryObj[el]);
// //     let sequelizeQueryObj = JSON.parse(JSON.stringify(queryObj));

// //     // Adjust the structure to match Sequelize's requirements in a concise manner
// //     const sequelizeFormattedQuery = {};
// //     for (let key in sequelizeQueryObj) {
// //       if (!sequelizeQueryObj[key]['gte'] && !sequelizeQueryObj[key]['lte']) {
// //         sequelizeFormattedQuery[key] = sequelizeQueryObj[key];
// //       } else {
// //         sequelizeFormattedQuery[key] = {};
// //         for (let op in sequelizeQueryObj[key]) {
// //           sequelizeFormattedQuery[key][Op[op]] = sequelizeQueryObj[key][op];
// //         }
// //       }
// //     }

// //     // FOR SORTING
// //     let orderClause = [['createdAt', 'DESC']]; // Default sorting
// //     if (sort) {
// //       const sortBy = sort.split(',').map(field => field.trim());
// //       orderClause = sortBy.map(field => {
// //         const sortOrder = field.startsWith('-') ? 'DESC' : 'ASC';
// //         const fieldName = field.replace(/^-/, '');
// //         return [fieldName, sortOrder];
// //       });
// //     }
// //     //For Fields
// //     // Build the attributes clause dynamically
// //     let attributesClause = { exclude: ['__v'] }; // Default to exclude '__v'
// //     console.log(fields, req.query.fields);
// //     // if (fields) {
// //     //   attributesClause = fields.split(',').map(field => field.trim());
// //     // }
// //     if (fields) {
// //       const includeFields = [];
// //       const excludeFields = [];
// //       fields.split(',').forEach(field => {
// //         field = field.trim();
// //         if (field.startsWith('-')) {
// //           excludeFields.push(field.slice(1));
// //           console.log(excludeFields);
// //           attributesClause = { exclude: excludeFields };
// //         } else {
// //           includeFields.push(field);
// //           console.log(includeFields);
// //           attributesClause = includeFields;
// //         }
// //       });
// //     }

// //     // Pagination
// //     console.log(page, limit);
// //     const pageNum = page * 1 || 1;
// //     const limitNum = limit * 1 || 100;
// //     const offsetNum = (pageNum - 1) * limitNum;

// //     // Query
// //     const query = Tour.findAll({
// //       where: sequelizeFormattedQuery,
// //       order: orderClause,
// //       attributes: attributesClause,
// //       limit: limitNum,
// //       offset: offsetNum
// //     });

// //     // Await The Query
// //     const tours = await query;

// //     // Check Length
// //     if (tours.length == 0) {
// //       return res.status(404).json({ status: 'Tour Not Found' });
// //     }

// //     // SEND RESPONSE
// //     res.status(200).json({
// //       status: 'success',
// //       results: tours.length,
// //       data: {
// //         tours
// //       }
// //     });
// //   } catch (err) {
// //     res.status(404).json({
// //       status: 'fail',
// //       message: err
// //     });
// //   }
// // };
// // if (fields) {
// //   attributesClause = fields.split(',').map(field => field.trim());
// // }
// const sequelize = require('../sequelize.js');
// const { DataTypes, Op, where } = require('sequelize');
// const slugify = require('slugify');
// // const validator = require('validator');

// const Tour = sequelize.define(
//   'tour',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: {
//         args: true,
//         msg: 'A tour must have a unique name'
//       },
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a name'
//         },
//         len: {
//           args: [10, 40],
//           msg: 'A tour name must have between 10 and 40 characters'
//         }
//       },
//       set(value) {
//         console.log('Setter invoked with value:', value);
//         this.setDataValue('name', value.trim());
//       }
//     },
//     slug: {
//       type: DataTypes.STRING
//     },
//     duration: {
//       type: DataTypes.INTEGER, // Use INTEGER for numeric values
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a duration'
//         }
//       }
//     },
//     maxgroup_size: {
//       type: DataTypes.INTEGER,
//       default: 10,
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a group size'
//         }
//       }
//     },
//     difficulty: {
//       type: DataTypes.ENUM,
//       values: ['easy', 'medium', 'difficult'],
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a difficulty'
//         },
//         isIn: {
//           args: [['easy', 'medium', 'difficult']],
//           msg: 'Difficulty is either: easy, medium, difficult'
//         }
//       }
//     },
//     ratings_average: {
//       type: DataTypes.FLOAT,
//       defaultValue: 4.5,
//       validate: {
//         min: {
//           args: [1],
//           msg: 'Rating must be above 1.0'
//         },
//         max: {
//           args: [5],
//           msg: 'Rating must be below 5.0'
//         }
//       }
//     },
//     ratings_quantity: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0
//     },
//     price: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a price'
//         }
//       }
//     },
//     price_discount: {
//       type: DataTypes.FLOAT,
//       validate: {
//         isValidDiscount(value) {
//           if (value >= this.price) {
//             throw new Error('Discount price should be below regular price');
//           }
//         }
//       }
//     },
//     summary: {
//       type: DataTypes.STRING,
//       set(value) {
//         // Custom setter to trim whitespace from the beginning and end
//         this.setDataValue('summary', value.trim());
//       },
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a description'
//         }
//       }
//     },
//     description: {
//       type: DataTypes.STRING(1000),
//       set(value) {
//         console.log('Setter invoked with value:', value);
//         this.setDataValue('description', value.trim());
//       }
//     },
//     image_cover: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: {
//           args: true,
//           msg: 'A tour must have a cover image'
//         }
//       }
//     },
//     images: {
//       type: DataTypes.ARRAY(DataTypes.STRING)
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: Date.now(),
//       allowNull: false,
//       select: false
//     },
//     start_dates: {
//       type: DataTypes.ARRAY(DataTypes.DATE)
//     },
//     secret_tour: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     }
//   },
//   {
//     tableName: 'tour',
//     defaultScope: {
//       attributes: { exclude: ['createdAt'] }
//     }
//     // hooks: {
//     //   beforeSave: (tour, options) => {
//     //     tour.slug = slugify(tour.name, { lower: true });
//     //   },
//     //   beforeFind: options => {
//     //     if (!options.where) options.where = {};
//     //     options.where.secretTour = { [Sequelize.Op.ne]: true };
//     //     options.startTime = Date.now();
//     //   },
//     //   afterFind: (result, options) => {
//     //     if (options.startTime) {
//     //       console.log(
//     //         `Query took ${Date.now() - options.startTime} milliseconds!`
//     //       );
//     //     }
//     //   }
//     // }
//     // Explicitly specify the table name if it doesn't match the model name// Explicitly specify the table name if it doesn't match the model name
//     // timestamps: true
//     // hooks: {
//     //   beforeValidate: (Tour, options) => {
//     //     if (Tour.name) {
//     //       Tour.name = Tour.name.trim();
//     //     }
//     //   }
//     // }
//   }
// );

// // Virtual property example (not exactly as in Mongoose)
// Tour.prototype.toJSON = function() {
//   const values = Object.assign({}, this.get());
//   values.duration_weeks = this.duration / 7;
//   return values;
// };

// // Hooks example
// Tour.addHook('beforeSave', async (tour, options) => {
//   if (tour.name) {
//     tour.slug = slugify(tour.name, { lower: true });
//   }
//   console.log('options', options);
// });
// Tour.addHook('afterSave', async (doc, options) => {
//   console.log('doc', doc, 'option', options);
// });

// // Pre-find hook example
// Tour.addHook('beforeFind', async options => {
//   if (!options.where) options.where = {};
//   options.where.secret_tour = { [Op.ne]: true };
//   options.startTime = Date.now();
// });

// // Post-find hook example
// Tour.addHook('afterFind', async (result, options) => {
//   if (options.startTime) {
//     console.log(`Query took ${Date.now() - options.startTime} milliseconds!`);
//   }
// });

// // Aggregation middleware example (not exactly as in MongoDB)
// // Tour.addHook('beforeFind', (options) => {
// //   if (options && options.where) {
// //     options.where.secretTour = { [Op.ne]: true };
// //   } else {
// //     options.where = { secretTour: { [Op.ne]: true } };
// //   }
// //   console.log('Query options:', options);
// // });

// // Tour.addHook('beforeAggregate', async options => {
// //   if (options && options.pipeline) {
// //     options.pipeline.unshift({
// //       $match: { secretTour: { [sequelize.Op.ne]: true } }
// //     });
// //     console.log('Aggregation pipeline:', options.pipeline);
// //   }
// // });
// async function syncUserModel() {
//   try {
//     await Tour.sync({ alter: true });
//     console.log('User Model synced');
//   } catch (error) {
//     console.error('Error syncing User Model:', error);
//   }
// }

// // Call the function to execute the sync
// syncUserModel();

// module.exports = Tour;

//const fs = require('fs');
//const { nextTick } = require('process');
//const Mongoose = require('mongoose');

const AppError = require('../utils/appError');

const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// //done

// exports.createTour = catchAsync(async (req, res, next) => {
//   //first way
//   // const newTour=  new Tour({}));
//   // newTour.save();
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',

//     // results: tours.length,
//     data: {
//       tour: newTour
//     }
//   });
// });

//   try {
//     } catch (err) {
//     res.status(400).json({
//       status: 'error',
//       message: 'invaild data'
//     });
//   }
// });

// //done
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const feature = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await feature.query;
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours
//     }
//   });
// });
// //done
// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   if (!tour) {
//     return next(new AppError('no tour found with that id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });

exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour);
exports.deleteTour = factory.deleteOne(Tour);
// //done
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });
//   if (!tour) {
//     return next(new AppError('no tour found with that id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });

// //done

//v__1
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('no tour found with that id', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     message: 'Tour has been deleted',
//     data: null
//   });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1;
//   const plan = await Tour.aggregate([]);
//   res.status(200).json({
//     status: 'success',
//     data: plan
//   });
// });
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: null,
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: stats
  });
});

///hekko git

// exports.checkID = (req, res, next, val) => {
//console.log(`id is ${val}`);
// if (id > tours.length) {
// if (req.params.id * 1 > tours.length) {
//   return res.status(404).json({
//     status: 'fail',
//     message: 'could not find tour'
//   });
// }
// next();
//};

//done
// res.status(200).json({
//   requestedAt: req.requestTime,
//   status: 'success',
//   results: tours.length,
//   data: { tours }
// });
// console.log(req.params);
// const id = req.params.id * 1; //casting number
// const tour = tours.find(el => el.id === id);
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour
//   }
// });
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour: 'updatad'
//   }
// });
// exports.getTours = (req, res) => {};
// //read json file
// // const tours = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// // );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.price || !req.body.name) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing nameorprices',
//     });
//   }
//   next();
// };
// exports.checkID = (req, res, next, val) => {
//   console.log(`id is ${val}`);
//   // if (id > tours.length) {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'could not find tour',
//     });
//   }
//   next();
// };

// //route handlers for Tours
// exports.getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     requestedAt: req.requestTime,
//     status: 'success',
//     results: tours.length,
//     data: { tours },
//   });
// };
// exports.getTour = (req, res) => {
//   console.log(req.params);
//   const id = req.params.id * 1; //casting number
//   const tour = tours.find((el) => el.id === id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// exports.updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: 'updatad',
//     },
//   });
// };

// exports.deleteTour = (req, res) => {
//   res.status(204).json({
//     status: 'success',
//     data: {
//       tour: null,
//     },
//   });
// };
// exports.createTour = (req, res) => {
//   const newID = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newID }, req.body);
//   tours.push(newTour);

//   //console.log(req.body);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         // results: tours.length,
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// tours-withen/:distance/center/:latlng/unit/unit
exports.getToursWithen = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    return next(new AppError('please provide the lat&&lng', 400)); // 400=>bad requst
  }
  console.log(distance, lat, lng, unit);
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    status: 'succese',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    return next(new AppError('please provide the lat&&lng', 400)); // 400=>bad requst
  }
  // console.log(distances, lat, lng, unit);
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'succese',
    data: {
      data: distances
    }
  });
});

//const fs = require('fs');
//const { nextTick } = require('process');
//const Mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//done
exports.createTour = catchAsync(async (req, res, next) => {
  //first way
  // const newTour=  new Tour({}));
  // newTour.save();
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',

    // results: tours.length,
    data: {
      tour: newTour
    }
  });
});

//   try {
//     } catch (err) {
//     res.status(400).json({
//       status: 'error',
//       message: 'invaild data'
//     });
//   }
// });

//done
exports.getAllTours = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await feature.query;
  res.status(200).json({
    status: 'success',
    data: {
      tours
    }
  });
});
//done
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
//done
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
//done
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Tour has been deleted',
    data: null
  });
});

// exports.getMonthlyPlan = async (req, res) => {
//   try {
//     const year = req.params.year * 1;
//     const plan = await Tour.aggregate([]);
//     res.status(200).json({
//       status: 'success',
//       data: plan
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'failed',
//       message: err
//     });
//   }
// };
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

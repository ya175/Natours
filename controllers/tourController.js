//const fs = require('fs');
//const { nextTick } = require('process');
const Tour = require('./../models/tourModel');

//done
exports.createTour = async (req, res) => {
  //first way
  // const newTour=  new Tour({}));
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      // results: tours.length,
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'invaild data'
    });
  }
};

//done
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
//done
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
//done
exports.updateTour = async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  try {
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
//done
exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);

  try {
    res.status(204).json({
      status: 'success',
      message: 'Tour has been deleted',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

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

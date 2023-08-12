const express = require('express');
const tourController = require('./../controllers/tourController');

const authController = require('./../controllers/authController');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/tours-withen/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithen);

//router.param('id', tourController.checkID);
// ro utes

router.use('/:tourId/reviews', reviewRouter); //wheereever you see '/:tourId/reviews' use reviewRouter instead

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.route('/tour-stats').get(tourController.getTourStats);
// router
//   .route('/monthly-plan/:year')
//   .get(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide', 'guide'),
//     tourController.getoMonthlyPlan
//   );

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;

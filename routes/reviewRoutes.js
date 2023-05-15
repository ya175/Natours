const express = require('express');
const authController = require('./../controllers/authController');

const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });
//each route is able to seeonly its params so  the reviewRouter see the tourId,user

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setToursUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview
  );
module.exports = router;

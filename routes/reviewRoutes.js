const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

const reviewController = require('../controllers/reviewController');

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;

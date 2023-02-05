const mongoose = require('mongoose');

//creating mongoose.Schema

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour must have name '],
    unique: true,
    trim: true
  },

  price: {
    type: Number,
    required: [true, 'tour must have price ']
  },
  rating: {
    type: Number,
    default: 4.5
  },

  ratingAverage: {
    type: Number,
    default: 4.5
  },
  ratingQuantity: {
    type: Number,
    defaultValue: 0
  },
  duration: {
    type: Number,
    required: [true, 'tour must have duration ']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'tour must have groupSize ']
  },
  difficulty: {
    type: String,
    required: [true, 'tour must have difficulty ']
  },
  priceiscount: Number,
  summary: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'tour must have imageCover ']
  },
  images: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');
//creating mongoose.Schema

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour must have name '],
      unique: true,
      trim: true,
      maxLength: [40, 'maxlenght is 40'],
      minLength: [10, 'min 10 ']
      //      validate: [validator.isAlpha, 'tour name must constain charsonly']
    },
    slug: String,
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
      default: 4.5,
      min: [1, 'min is 1'],
      max: [5, 'max is 5']
    },
    ratingQuantity: {
      type: Number,
      defaultValue: 0
    },
    duration: {
      type: Number,
      required: [true, 'tour must have duration ']
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    maxGroupSize: {
      type: Number,
      required: [true, 'tour must have groupSize ']
    },
    difficulty: {
      type: String,
      required: [true, 'tour must have difficulty '],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'tour must have difficulty'
      }
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'invalid discount gt price'
      }
    },
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
      default: Date.now(),
      select: false
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    startDates: [Date],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
//indexes
tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});
//8-104
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//quer middleware
tourSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});
tourSchema.post(/^find/, function(docs, next) {
  console.log(docs);
  console.log(`the qury took ${Date.now() - this.start} milli second`);
  next();
});

//aggregate middleware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
// tourSchema.pre('save', function(next) {
//   console.log('saving...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

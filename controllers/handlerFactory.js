const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`no document found with that id`, 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'Tour has been deleted',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //true to return the updated doc rather than the old one
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('no document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    //first way
    // const newTour=  new Tour({}));
    // newTour.save();
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',

      // results: tours.length,
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptoins) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptoins) query = query.populate(popOptoins);
    const doc = await query;
    if (!doc) {
      return next(new AppError('no document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // allow nested get review on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const feature = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await feature.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

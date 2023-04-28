const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('this route is not for updating password', 400)); // 400 bad request
  }
  //)FilterOut unwanted Fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    user: updatedUser
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.getAllUsres = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    //500 internal server eror
    status: 'success',
    message: ' implemented ',
    data: users
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    //500 internal server eror
    status: 'error',
    message: 'not implemented yet'
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    //500 internal server eror
    status: 'error',
    message: 'not implemented yet'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    //500 internal server eror
    status: 'error',
    message: 'not implemented yet'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    //500 internal server eror
    status: 'error',
    message: 'not implemented yet'
  });
};

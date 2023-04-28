const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
//const { decode } = require('querystring');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure:true,
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1)
  if (!email || !password) {
    return next(new AppError('please enter a valid email and password', 400));
  }
  //2)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctMyPassword(password, user.password))) {
    return next(new AppError('invalid email or password', 401));
  }
  //console.log(user);
  //3) send token
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) getting token && check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('you are not loged in,please log in to get access', 401)
    );
  }
  //2)verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(`user decoded : ${decoded}`);
  //3)check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('the user of this token does not longer exist', 401)
    );
  }
  //4) check ifuser changed password after th JWT

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('this user recently changed password ,please try again', 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you donot have permission to do this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on posted E-mail

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError((' here is no user with this email ', 404)));
  } //2) generate random token
  const resetToken = user.createPasswordResetToken();
  //user.passwordResetToken = this.PasswordResetToken;
  //user.PasswordResetExpires = this.PasswordResetExpires;
  //console.log(this.pass)
  await user.save({ validateBeforeSave: false });

  //3) send token to e-mail
  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    // await sendEmail({
    //   email: user.email,
    //   subject: 'your pass reset token is vallid for only 10 min',
    //   message
    // });

    await new Email(user, resetUrl).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: `'token has been sent to your email'`
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        ' there is an error with  sending this email ,please try again later!',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user basedon token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex'); // encrypt  the token sent to user

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // console.log(user.PasswordResetExpires>=Date.now())
  // console.log(await User.findOne({PasswordResetToken:hashedToken}))
  //console.log(user.passwordResetToken,hashedToken)

  //2)if token has not expired and there is user ,set the new password

  //console.log((user.passwordResetExpires+0),Date.now()+0,user.passwordResetExpires==Date.now())
  if (!user) {
    return next(new AppError('token invalid or has been expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.PasswordResetExpires = undefined;

  await user.save();

  //3)update     the changedPasswordAt property

  //4)log the user in(send JWT Token)
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)get user form collection
  const user = await User.findOne(req.user._id).select('+password');
  //2) checkif the posted password is correct
  if (
    !(await user.correctMyPassword(req.body.currentPassword, user.password))
  ) {
    return next(new AppError('wrong password', '400'));
  }

  //3)update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4)log user  in
  createSendToken(user, 200, res);
});

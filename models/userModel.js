const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');
const { query } = require('express');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us the name']
  },
  email: {
    type: String,
    lowercase: true,
    requird: [true, 'Please enter a valid email'],
    unique: true,
    validate: [validator.isEmail, 'please enter a valid email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Please enter a valid password'],
    select: false
  },
  passwordConfirm: {
    type: String,
    requird: [true, 'Please enter a valid password'],
    validate: {
      validator: async function(el) {
        return el === this.password;
      },
      message: 'passwords are not the same'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});
userSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function(next) {
  //  this stand for the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctMyPassword = async function(
  cadidatePassword,
  userPassword
) {
  return await bcrypt.compare(cadidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
    // console.log(this.passwordChangedAt, JWTTimestamp);
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  //console.log(` expire in ${this.passwordResetExpires}`)
  //console.log(this)
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

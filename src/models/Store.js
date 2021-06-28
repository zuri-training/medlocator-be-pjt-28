const crypto = require('crypto');
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const storeSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Enter a name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Enter an email'],
    validate: {
      validator: function (value) {
        return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,}\.*[a-zA-Z]*$/.test(value.toLowerCase());
      },
      message: 'Enter a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  address: {
    type: String,
    required: true,
  },
  contact: {
    owner: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
  },
});

storeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

storeSchema.pre('save', function (next) {
  if (!this.isModified('passwords') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

storeSchema.methods.passwordsMatch = async function (passwordInput, password) {
  return await bcrypt.compare(passwordInput, password);
};

storeSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = model('Store', storeSchema);

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
        return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value.toLowerCase());
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
  address: {
    type: String,
    required: true,
  },
  drugs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Drug',
    },
  ],
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

storeSchema.methods.passwordsMatch = async function (passwordInput, password) {
  return await bcrypt.compare(passwordInput, password);
};

module.exports = model('Store', storeSchema);

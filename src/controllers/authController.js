const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const Store = require('../models/Store');

const {JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES, NODE_ENV,
  EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_SENDER} = require('../config/constants');

// Email Service
const emailService = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: EMAIL_SENDER,
    to: email,
    subject,
    text: message,
  });
};

// Generate JWT token
const genToken = ({ _id: id }) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

// Send JWT token in response body
const sendToken = (store, statusCode, res) => {
  const token = genToken(store);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        parseInt(JWT_COOKIE_EXPIRES, 10) * 24 * 60 * 60 * 1000
    ),
    ...(NODE_ENV === 'production' && {
      secure: true,
    }),
    httpOnly: true,
  });

  store.password = undefined;
  store.activationKey = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    store,
  });
};

const generateRandomId = () => {
  const chars = [
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcddefghijklmopqrstuvwxyz',
  ];
  return [...Array(50)].map(i => chars[(Math.random() * chars.length) | 0])
    .join``;
};

// @desc  Register a store
// @route POST /api/v1/auth/register
// @access Public

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, address, contact } =
      req.body;

    const store = await Store({
      name,
      email,
      password,
      passwordConfirm,
      address,
      contact,
      activationKey: generateRandomId(),
    });

    await store.save();

    const ACTIVATION_URL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/activate/${store.activationKey}`;

    let message = `
      Send a get request to: <ACTIVATION_URL>. to activate your account
    `;

    const emailOptions = {
      email: store.email,
      subject: 'Confirm Your Account',
      message: message.replace('<ACTIVATION_URL>', ACTIVATION_URL).trim(),
    };

    await emailService(emailOptions);

    sendToken(store, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc  Login a Store
// @route POST /api/v1/auth/login
// @access Public

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error('Enter email or password');
    }

    const store = await Store.findOne({ email }).select('+password');

    if (!store.active) {
      throw new Error('This store is not active');
    }

    if (!(store && (await store.passwordsMatch(password, store.password)))) {
      throw new Error('Incorrect email or password');
    }

    sendToken(store, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error('You are not logged in. Login to get access');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const store = await Store.findById(decoded.id);

    if (!store) {
      throw new Error('Token no longer exists');
    }

    if (store.passwordChangedAfter(decoded.iat)) {
      throw new Error(
        'Password was changed recently, login again to get access'
      );
    }

    req.store = store;

    next();
  } catch (err) {
    next(err);
  }
};

// @desc Send Reset Token via email
// @route POST api/v1/auth/forgot-password
// @access Public

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error('Provide an email');
    }

    const store = await Store.findOne({ email });

    if (!store) {
      throw new Error('There is no store with this email address');
    }

    const resetToken = store.createPasswordResetToken();

    await store.save({
      validateBeforeSave: false,
    });

    const RESET_URL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/reset-password/${resetToken}`;

    let message = `
      Forgot your password? Send a patch request with your new password to: <RESET_TOKEN_URL>. If you did not make this request, please ignore this email
    `;

    const emailOptions = {
      email: store.email,
      subject: 'Your password Reset Token (Expires in 10mins)',
      message: message.replace('<RESET_TOKEN_URL>', RESET_URL).trim(),
    };

    try {
      await emailService(emailOptions);
      res.status(200).json({
        status: 'success',
        message: 'Token Sent',
      });
    } catch (err) {
      store.passwordResetToken = undefined;
      store.passwordResetTokenExpires = undefined;
      await store.save({ validateBeforeSave: false });

      return next(
        new Error('There was an error sending the email, try again later')
      );
    }
  } catch (err) {
    next(err);
  }
};

// @desc Reset Password
// @route PATCH api/v1/auth/forgot-password
// @access Public

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, passwordConfirm } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const store = await Store.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!store) {
      throw new Error('Invalid or Expired Token');
    }
    store.password = password;
    store.passwordConfirm = passwordConfirm;
    store.passwordResetToken = undefined;
    store.passwordResetTokenExpires = undefined;

    await store.save();
    sendToken(store, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc Log store out/Clear cookie
// @route GET api/v1/auth/logout
// @access Private

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    data: {},
  });
};

// @desc Activate store
// @route GET api/v1/auth/activate/activationKey
// @access Private

exports.activateStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({
      activationKey: req.params.activationKey,
    });

    store.active = true;
    await store.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      status: 'success',
      message: 'Store activated',
    });
  } catch (err) {
    next(err);
  }
};

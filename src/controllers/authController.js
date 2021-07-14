const crypto = require('crypto');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const Store = require('../models/Store');

const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES,
  NODE_ENV,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_SENDER,
} = require('../config/constants');

class Email {
  constructor(store, url) {
    this.to = store.email;
    this.url = url;
    this.from = EMAIL_SENDER;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject, body) {
    const html = await ejs.renderFile(
      `${__dirname}/../views/emails/${template}.ejs`,
      {
        url: this.url,
        subject,
        body
      }
    );

    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.newTransport().sendMail(emailOptions);
  }

  async sendWelcome() {
    await this.send('email-verification','Email Verification');
  }
}

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
      Date.now() + parseInt(JWT_COOKIE_EXPIRES, 10) * 24 * 60 * 60 * 1000
    ),
    ...(NODE_ENV === 'production' && {
      secure: true,
    }),
    httpOnly: true,
  });

  store.password = undefined;
  store.activationKey = undefined;
  store.activationKeyExpires = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    store,
  });
};

// @desc  Register a store
// @route POST /api/v1/auth/register
// @access Public

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, address, contact, geometry, place_id } =
      req.body;

    if(password !== passwordConfirm){
      const err = new Error("Passwords do not match");
      err.status = 400;
      throw err;
    }
    if(!address){
      const err = new Error("Address is required");
      err.status = 400;
      throw err;
    }

    const store = await Store({
      name,
      email,
      password,
      passwordConfirm,
      address,
      geometry,
      contact,
      place_id,
    });

    await store.save();

    const ACTIVATION_URL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/activate/${store.activationKey}`;

    try {
      await new Email(store, ACTIVATION_URL).sendWelcome();
    } catch (error) {
      store.activationKey = undefined;
      store.activationKeyExpires = undefined;
      await store.save({
        validateBeforeSave: false,
      });
      return next(new Error('An error occured sending the email'));
    }

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

    if(!store){
      next(new Error('This email is not registered'));
    }

    else if (!store.active) {
      next(new Error('This store is not active'));
    }

    else if (!(store && (await store.passwordsMatch(password, store.password)))) {
      next(new Error('Incorrect email or password'));
    }

    else {
      sendToken(store, 200, res);
    }
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

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

    res.status(200).json({
      status: 'success',
      resetUrl: RESET_URL,
    });
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
      activationKeyExpires: { $gt: Date.now() },
    });

    store.active = true;
    store.activationKey = undefined;
    store.activationKeyExpires = undefined;
    await store.save({
      validateBeforeSave: false,
    });
    res.status(302).redirect('https://zurimed.netlify.app/login.html');
  } catch (err) {
    next(err);
  }
};

exports.contactMail = async (req, res, next) => {
  try {
    const { fullname, designation, contact_type, comment, email } = req.body;
    const body = { fullname, designation, contact_type, comment, email }
    await new Email({email:EMAIL_USERNAME}, null).send('feedback','User Feedback',body);
    res.status(200).json({
      status: 'success',
      message: 'Email sent successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
const jwt = require('jsonwebtoken');

const Store = require('../models/Store');

const genToken = ({ _id: id }) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendToken = (store, statusCode, res) => {
  const token = genToken(store);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES, 10) * 24 * 60 * 60 * 1000
    ),
    ...(process.env.NODE_ENV === 'production' && {
      secure: true,
    }),
    httpOnly: true,
  });

  store.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    store,
  });
};

// @desc  Register a store
// @route POST /api/v1/auth/register
// @access Private

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, address, contact } =
      req.body;

    const store = await Store.create({
      name,
      email,
      password,
      passwordConfirm,
      address,
      contact,
    });

    sendToken(store, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc  Login a Store
// @route POST /api/v1/auth/login
// @access Private

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error('Enter email or password');
    }

    const store = await Store.findOne({ email }).select('+password');

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
    console.log(req.cookies);

    if (!token) {
      throw new Error('You are not logged in. Login to get access');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const store = await Store.findById(decoded.id);

    if (!store) {
      throw new Error('Token no longer exists');
    }

    req.store = store;

    next();
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

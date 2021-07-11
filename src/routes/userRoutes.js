const {
  logout,
  login,
  register,
  forgotPassword,
  resetPassword,
  activateStore,
  contactMail
} = require('../controllers/authController');
const { forwardHandler, checkCoords } = require("../controllers/locationController");
const router = require('express').Router();

router.post('/register', checkCoords, forwardHandler, register);
router.post('/login', login);

router.post("/contact",contactMail);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:resetToken', resetPassword);

router.get('/logout', logout);
router.get('/activate/:activationKey', activateStore);

module.exports = router;

const {
  logout,
  login,
  register,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:resetToken', resetPassword);

router.get('/logout', logout);

module.exports = router;

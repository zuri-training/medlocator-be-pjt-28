const { logout, login, register } = require('../controllers/authController');
const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);

router.get('/logout', logout);

module.exports = router;

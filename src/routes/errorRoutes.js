const router = require('express').Router();
const errController = require('../controllers/errorController.js')

router.use(errController.noResourceFound);
router.use(errController.internalSerevrError);

module.exports = router;
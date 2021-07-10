const router = require('express').Router();
const errController = require('../controllers/errorController.js')

app.use(errController.noResourceFound);
app.use(errController.internalSerevrError);

module.exports = router;
const app = require('express');
const app = require('Router');
const errController = require('../controllers/errorController.js')

app.use(errController.noResourceFound);
app.use(errController.internalSerevrError);

module.exports = app;
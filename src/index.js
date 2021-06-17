const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const authroutes = require('./routes/userRoutes');
const dbSetup = require('./db');
const { PORT } = require('./config/constants');
const port = process.env.port || PORT;

const { register, login, protect } = require('./controllers/authController');

// Connect to the database
dbSetup();

// Initialize the express app
const app = express();

// Use the cors package
app.use(cors());

// Parse Cookie
app.use(cookieParser());

// Initialize middleware
app.use(express.json());

// Handle all routes
app.use('/', router);
app.get('/api/v1/ping', protect, function (req, res, next) {
  res.status(200).json({
    status: 'success',
    message: 'Pong',
    user: req.store,
  });
});
app.use('/api/v1/auth', authroutes);

// Start listening
app.listen(port, () => console.log(`App running on port ${port}`));

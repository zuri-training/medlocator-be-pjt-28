const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const dbSetup = require('./db');
const { PORT } = require('./config/constants');
const port = process.env.port || PORT;
const errorRoutes = require('./errorRoutes');

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
app.use(express.urlencoded({extended:true}));

// Handle all routes
app.use('/', router);
app.use('/api/v1/auth', authroutes);
app.use('/', errorRoutes);


// Start listening
app.listen(port, () => console.log(`App running on port ${port}`));

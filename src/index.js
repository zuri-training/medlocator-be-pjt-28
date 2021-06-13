const express = require("express");
const cors = require("cors");
const router = require("./routes");
const dbSetup = require("./db");
const {PORT} = require("./config/constants");
const port = process.env.port || PORT;

// Connect to the database
dbSetup();

// Initialize the express app
const app = express();

// Use the cors package
app.use(cors());

// Initialize middleware
app.use(express.json());

// Handle all routes
app.use("/", router);

// Start listening
app.listen(port, () => console.log(`App running on port ${port}`));
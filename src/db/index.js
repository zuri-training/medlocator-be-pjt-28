const mongoose = require("mongoose");
const {MONGO_URI} = require("../config/constants");

const connectDb = () => {
    mongoose.connect(MONGO_URI,{
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("MongoDB database connected");
    })
    .catch(err => {
        console.error(`Error connecting DB: ${err.message}`);
        process.exit(1);
    })
};

module.exports = connectDb;
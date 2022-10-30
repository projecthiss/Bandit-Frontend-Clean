require('dotenv').config({path:__dirname+'/../.env'});

const MONGO_URI =
    process.env.MONGO_URI
/**
 *  Establish the connection to the mongoDb via mongoose
 */

/**
 *  Export the connection
 */

const mongoose = require("mongoose");

mongoose.connect(MONGO_URI, { useNewUrlParser: true , useUnifiedTopology: true });

module.exports = {
    mongoose: mongoose
};
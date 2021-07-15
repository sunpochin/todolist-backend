//jshint esversion:9
// db.js
const mongoose = require("mongoose");
const User = require('../models/user');
let mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  console.log("trying to connect mongoURI: ", mongoURI);
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("MongoDB is Connected.");
  } catch (err) {
    console.error('error: ', err);
    // process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB is disconnected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  closeDB
};

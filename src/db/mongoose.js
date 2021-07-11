//jshint esversion:9
// db.js
const mongoose = require("mongoose");
const config = require("config");
const User = require('../models/user');
// const db = config.get('mongoURI');
// console.log('db config: ', db);
let mongoURI =
  // "mongodb+srv://" +
  // process.env.MONGODB_ADMIN +
  // ":" +
  // process.env.MONGODB_PASSWORD +
  process.env.MONGODB_URI;
// const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/api-test?retryWrites=false";
// console.log('mongoURI: ', mongoURI);

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

//jshint esversion:6
// db.js

const mongoose = require('mongoose');
const config = require('config');
// const db = config.get('mongoURI');
const mongoURI = "mongodb+srv://" + process.env.MONGODB_ADMIN + ":" + process.env.MONGODB_PASSWORD + process.env.MONGODB_URI;
// const mongoURI = "mongodb://localhost:27017/notesDB";


const connectDB = async () => {
  try {
    await mongoose.connect(
      mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    );

    console.log('MongoDB is Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

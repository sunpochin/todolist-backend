//jshint esversion:9
// db.js
const mongoose = require("mongoose");
const config = require("config");
const User = require('../models/user');

// const db = config.get('mongoURI');
// const mongoURI =
// 	"mongodb+srv://" +
// 	process.env.MONGODB_ADMIN +
// 	":" +
// 	process.env.MONGODB_PASSWORD +
// 	process.env.MONGODB_URI;
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/api-test?retryWrites=false";


const connectDB = async() => {
  console.log("mongoURI: ", mongoURI);
	try {
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		// console.log("MongoDB is Connected...");
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};
module.exports = { connectDB };

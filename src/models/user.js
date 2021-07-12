//jshint esversion:6

const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
// const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	// name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	googleId: String,
	// email: String,
	password: String,
	// googleId: { type: String },
	// image: { type: String, required: true },
	todos: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Todo" }],
});

userSchema.plugin(uniqueValidator);
// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// module.exports = mongoose.model('User', userSchema);
const User = new mongoose.model('User', userSchema);
// console.log('new mongoose.model("User"');
module.exports = User

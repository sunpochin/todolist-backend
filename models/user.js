const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 6 },
	googleId: { type: String },
	// image: { type: String, required: true },
	places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// module.exports = mongoose.model('User', userSchema);
const User = new mongoose.model("User", userSchema);
module.exports = User;

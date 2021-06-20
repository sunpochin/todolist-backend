//jshint esversion:8
const bcrypt = require("bcryptjs");

const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const User = require("../models/user");

let password = "1234567";
// duplicated codes
const haha = async function(password) {
	let hashedPassword;
	try {
		const salt = 12;
		hashedPassword = await bcrypt.hash(password, salt);
	} catch (err) {
		console.log('err: ', err);
		
		// return next(error);
	}
	return hashedPassword;
};

let userOne;
let hashedPassword;
beforeEach(async () => {
	hashedPassword = await haha(password);
	console.log('hashedPassword: ', hashedPassword);
		userOne = {
		name: "test user",
		email: "testuser@ab.com",
		password: hashedPassword
	};
	console.log("before each");
	// await User.deleteMany({}).exec();
	// await mongoose.connection.db.dropCollection("users");

	mongoose.connection.collections["users"].drop(function (err) {
		console.log("collection dropped");
	});

	await new User(userOne).save();
});

afterEach(() => {
	console.log("after each");
});

test("Get /", async () => {
	console.log("test get /");
	await request(app).get("/").expect(200);
});

test("Should login an existing user", async () => {
	await request(app)
		.post("/login")
		.send({
			email: userOne.email,
			password: '1234567',
		})
		.expect(200);
});

test("Should signup a new user", async () => {
	await request(app)
		.post("/signup")
		.send({
			name: "sunpo",
			email: "sunpochin@gmail.com",
			password: '1234567',
		})
		.expect(201);
});

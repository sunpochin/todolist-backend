//jshint esversion:9
const request = require("supertest");
const bcrypt = require("bcryptjs");
const db = require("mongoose");

const app = require("../src/app");
const User = require("../src/models/user");

// let hashedPassword;
const hashpassword = async function (password) {
	let hashedPassword;
	try {
		const salt = 12;
		hashedPassword = await bcrypt.hash(password, salt);
	} catch (err) {
		console.log("err: ", err);
		// return next(error);
	}
	return hashedPassword;
};

global.createTestUser = async () => {
	const password = "1234567";
	const hashedPassword = await hashpassword(password);
	console.log("hashedPassword: ", hashedPassword);
	userOne = {
		name: "test user",
		email: "testuser@ab.com",
		password: hashedPassword,
	};
	
	createRet = await new User(userOne).save();
	console.log("createRet: ", createRet);
	return [userOne, createRet];
};

global.loginTestUser = async () => {
	loginRet = await request(app)
		.post("/login")
		.send({
			email: userOne.email,
			password: "1234567",
		})
		.expect(200);
	console.log("loginRet: ", loginRet.body);
	return [loginRet];
};

// module.exports.createTestUser = createTestUser;
// module.exports.loginTestUser = loginTestUser;

//jshint esversion:8

const request = require("supertest");
const app = require("../app");
const User = require('../models/user');

beforeEach(async () => {
  console.log('before each');
  await User.deleteMany()
});

afterEach(() => {
  console.log('after each');
});

test("Get /", async () => {
	await request(app).get("/").expect(200);
});

test("Should signup a new user", async () => {
	await request(app)
		.post("/signup")
		.send({
			name: "sunpo",
			email: "sunpochin@gmail.com",
			password: "1234567",
		})
		.expect(201);
});

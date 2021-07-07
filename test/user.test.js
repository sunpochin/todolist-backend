//jshint esversion:9
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
let userOne;
let hashedPassword;
beforeEach(async () => {
	[userOne, hashedPassword] = await createTestUser();
	// console.log("before each");
	// await User.deleteMany({}).exec();
	// await mongoose.connection.db.dropCollection("users");
}, 10000);

// afterEach(() => {
// 	// console.log("after each");
// });

// test("Get /", async () => {
// 	console.log("test get /");
// 	await request(app).get("/").expect(200);
// });

test("Should login an existing user", async () => {
	await request(app)
		.post("/login")
		.send({
			email: userOne.email,
			password: '1234567',
		})
		.expect(200);
});

test("Should NOT login due to wrong password", async () => {
	await request(app)
		.post("/login")
		.send({
			email: userOne.email,
			password: 'xxxxxxxxxx',
		})
		.expect(403);
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

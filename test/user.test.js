//jshint esversion:9
const request = require("supertest");
const app = require("../app");
const db = require("../src/db/mongoose");

const User = require("../src/models/user");
let userOne;
let hashedPassword;


beforeAll(async () => {
  await db.connectDB();
  await User.collection.drop();
  [userOne, hashedPassword] = await createTestUser();
}, 10000);

afterAll(async() => {
	// await db.closeDB();
});

// test("Get /", async () => {
// 	console.log("test get /");
// 	await request(app).get("/").expect(200);
// });

test("Should login an existing user", async () => {
  await request(app)
    .post("/v1/login")
    .send({
      email: userOne.email,
      password: '1234567',
    })
    .expect(200);
});

test("Should NOT login due to wrong password", async () => {
  await request(app)
    .post("/v1/login")
    .send({
      email: userOne.email,
      password: 'xxxxxxxxxx',
    })
    .expect(403);
});

test("Should signup a new user", async () => {
  await request(app)
    .post("/v1/signup")
    .send({
      name: "sunpo",
      email: "sunpochin@gmail.com",
      password: '1234567',
    })
    .expect(201);
});

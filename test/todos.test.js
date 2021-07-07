//jshint esversion:9
const request = require("supertest");
const app = require("../src/app");
// const mongoose = require("../src/db/mongoose");
// const User = require("../src/models/user");
let userOne;
let hashedPassword;
beforeEach(async () => {
}, 10000);

afterEach(async() => {

});

test("Should login the test user and do CRUD of Todos.", async () => {
  // const loginRet = await loginTestUser();
  // await request(app)
  //   .post("/todos/add")
  //   .send({
  //     title: 'test add',
  //     description: 'test desc.',
  //     creator: loginRet._id
  //   })
  //   .expect(200);

});

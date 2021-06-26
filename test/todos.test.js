//jshint esversion:9
const request = require("supertest");
const app = require("../app");
const db = require("../db/mongoose");

beforeAll(() => {
  return db.connectDB();
});

let userOne;
let hashedPassword;
beforeEach(async () => {
	[userOne, hashedPassword] = await createTestUser();
}, 10000);

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


afterAll(() => {

});

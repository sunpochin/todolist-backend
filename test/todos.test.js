//jshint esversion:9
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/mongoose");

beforeAll(() => {
  // const mongoURI =
  // 	"mongodb+srv://" +
  // 	process.env.MONGODB_ADMIN +
  // 	":" +
  // 	process.env.MONGODB_PASSWORD +
  // 	process.env.MONGODB_URI;
  // console.log('');
  return db.connectDB();
});

let userOne;
let hashedPassword;
beforeEach(async () => {
	[userOne, hashedPassword] = await createTestUser();
}, 3000);

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

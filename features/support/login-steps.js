//jshint esversion:9
// features/support/steps.js

const request = require("supertest");
const app = require("../../app");

const helpers = require("../../test/helpers.js");

const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert").strict;

Given("I have users", function (number) {
	this.setTo(number);
});

Given("I go to {string}", async function (string) {
	// Write code here that turns the phrase above into concrete actions
	// return "pending";
	// let userOne = helpers.userOne;
	// console.log('helpers: ', helpers, helpers.createTestUser);
	[userOne, hashedPassword] = await helpers.
  createTestUser();

	console.log("userOne: ", userOne);
	await request(app)
		.post("/login")
		.send({
			email: userOne.email,
			password: "1234567",
		})
		.expect(200);
});

let ret;
When('I type {string} in {string}', async function (email, password) {
  // Write code here that turns the phrase above into concrete actions
  ret = await request(app)
  .post("/login")
  .send({
    email: email,
    password: password,
  })
  console.log('ret: ', ret.body, ret.status);
  // .expect(200);
});

Then('I should see {string}', function (string) {
  console.log('string: ', string, ', status:', ret.status);
  assert(string === ret.status.toString() );

});

// Given("I go to '/login'", async () => {
// 	// return fetch("http://localhost:3000/api/endpoint")
// 	// 	.then((res) => res.json())
// 	// 	.then((body) => doSomethingWithResponse(body));
// });

module.exports = { default: "--publish-quiet" };

// jshint esversion:9
// features/support/world.js
const { setWorldConstructor } = require("@cucumber/cucumber");
var {AfterAll, BeforeAll} = require('@cucumber/cucumber');
var {AfterStep, BeforeStep} = require('@cucumber/cucumber');

const db = require('../../db/mongoose.js');

class CustomWorld {
	constructor() {
		this.variable = 0;
	}
	setTo(number) {
		this.variable = number;
	}

	incrementBy(number) {
		this.variable += number;
	}
}

// https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md
// Asynchronous Callback
BeforeAll(function (callback) {
  // perform some shared setup
  // execute the callback (optionally passing an error when done)
  console.log('cucumber beforeall');
  callback();
});

// Asynchronous Promise
AfterAll(function () {
  // perform some shared teardown
  // console.log('db: ', db);
  db.closeDB();
});

setWorldConstructor(CustomWorld);

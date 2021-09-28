//jshint esversion: 9

// app.js
const serverless = require('serverless-http');
const express = require('express')
const app = express()

const db = require("./src/db/mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser"); // parse cookie
const passport = require("passport");
const passportSetup = require("./src/passport-setup");
const authRoutesV1 = require("./src/routes/v1/authRoutesV1");
// const authRoutesV2 = require("./routes/v2/authRoutesV2");
const mongoose = require("mongoose");
// const keys = require("../private-files/config/keys");

const todoRoutes = require("./src/routes/todo-routes");
const usersRoutes = require("./src/routes/users-routes");

db.connectDB();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

// parse cookies
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: true,
  credentials: true
}));

//
// set up routes
app.use("/v1/auth", authRoutesV1);
// app.use("/v2/auth", authRoutesV2);
app.use("/v1/todos", todoRoutes);
app.use("/v1", usersRoutes);
app.get("/", (req, res) => res.send("server by sunpochin@gmail.com"));

module.exports = app;
module.exports.handler = serverless(app);

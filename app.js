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

db.connectDB();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

// twitter auth part.
// app.use(
//   cookieSession({
//     name: "session",
//     keys: [keys.COOKIE_KEY],
//     maxAge: 24 * 60 * 60 * 100,
//     secure: false
//   })
// );
// parse cookies
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: true,
  credentials: true
}));

// const authCheck = (req, res, next) => {
//   if (!req.user) {
//     res.status(401).json({
//       authenticated: false,
//       message: "user has not been authenticated"
//     });
//   } else {
//     next();
//   }
// };
//
// // if it's already login, send the profile response,
// // otherwise, send a 401 response that the user is not authenticated
// // authCheck before navigating to home page
// app.get("/", authCheck, (req, res) => {
//   res.status(200).json({
//     authenticated: true,
//     message: "user successfully authenticated",
//     user: req.user,
//     cookies: req.cookies
//   });
// });
//
// set up routes
// const todoRoutes = require('./src/routes/todo-routes');
const itemsRoutes = require('./src/routes/items-routes');
const usersRoutes = require('./src/routes/users-routes');

app.use("/v1/auth", authRoutesV1);
// app.use("/v2/auth", authRoutesV2);
// app.use("/v1/todos", todoRoutes);
app.use('/v1/items', itemsRoutes);
app.use("/v1", usersRoutes);
app.get("/", (req, res) => res.send("server by sunpochin@gmail.com"));

module.exports = app;
module.exports.handler = serverless(app);

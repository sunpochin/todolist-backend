//jshint esversion: 9

// app.js
const db = require("./db/mongoose");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser"); // parse cookie
const passport = require("passport");
const passportSetup = require("./passport-setup");
const authRoutes = require("./routes/auth-routes");
const mongoose = require("mongoose");
const keys = require("../config/keys");


const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const todoRoutes = require("./routes/todo-routes");
const usersRoutes = require("./routes/users-routes");
const User = require("./models/user.js");
const app = express();

const CLIENT_HOME_PAGE_URL = "http://localhost:3000/list";

db.connectDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

// app.use(
//   session({
//     secret: "our little secret!",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(cors({
//   origin: true,
//   credentials: true
// }));
passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use("/todos", todoRoutes);
// app.use("/", usersRoutes);
// app.get("/", (req, res) => res.send("server by sunpochin@gmail.com"));


// twitter auth part.
app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);
// parse cookies
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: true,
  credentials: true
}));
// set up routes
app.use("/auth", authRoutes);


const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

module.exports = app;

//jshint esversion:6
// app.js
require("dotenv").config();
require("./db/mongoose");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

const todoRoutes = require("./routes/todo-routes");
const usersRoutes = require("./routes/users-routes");
const notes = require("./router/notes");
const User = require("./models/user.js");
const register = require("./router/register");


// Connect Database
// connectDB();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
	session({
		secret: "our little secret!",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:8081/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log("profile: ", profile);
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


// app.use("/api", notes);
app.use("/todos", todoRoutes);
app.use("/", usersRoutes);

app.get("/", (req, res) => res.send("server by sunpochin@gmail.com"));

module.exports = app;

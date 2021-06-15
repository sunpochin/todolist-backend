//jshint esversion:6
// app.js
require("dotenv").config();
const fs = require("fs");
const https = require("https");
const http = require("http");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const connectDB = require("./config/db");
const notes = require("./router/notes");
const User = require("./models/user.js");
const register = require("./router/register");

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

// Connect Database
connectDB();

app.use("/api", notes);
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => res.send("server by sunpochin@gmail.com"));

// const httpsPort = process.env.PORT || 8088;
const httpPort = 8081;
const httpsPort = 8082;

// const hostName = "localhost";
const httpsOptions = {
	ca: fs.readFileSync("./certificates/multi_498484707.ca-bundle", "utf8"),
	cert: fs.readFileSync("./certificates/multi_498484707.crt", "utf8"),
	key: fs.readFileSync("./certificates/yesido_me.key", "utf8"),
};

const httpsServer = https.createServer(httpsOptions, app);
const httpServer = http.createServer(app);

httpServer.listen(httpPort, () => {
	console.log("httpPort: ", httpPort);
});
httpsServer.listen(httpsPort, () => {
	console.log("httpSecure Port: ", httpsPort);
});

module.exports = app;

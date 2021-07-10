//jshint esversion: 9

const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user.js");

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


// when login is successful, retrieve user info
router.get("/twitter/login/success", (req, res) => {
  console.log('/twitter/login/success: ', req.body);
  if (req.user) {
    res.json({
      success: true,
      message: "twitter user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
router.get("/twitter/login/failed", (req, res) => {
  console.log('/login/failed: ', req.body);
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/twitter/logout", (req, res) => {
  console.log('/logout ', req.body);
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with twitter
router.get("/twitter", passport.authenticate("twitter"));

// redirect to home page after successfully login via twitter
router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

// auth with google
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8081/v1/auth/google/redirect",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile: ", profile);
    console.log('oauth accessToken', accessToken);
    User.findOrCreate({
      googleId: profile.id,
			email: profile.email
    }, function(err, user) {
      return done(err, user);
    });
    // var userData = {
    //     name: profile.displayName,
    //     token: accessToken
    //    };
    // done(null, userData);
  }
));

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

router.get('/google/redirect',
  passport.authenticate('google', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: CLIENT_HOME_PAGE_URL
  }),
  function(req, res) {
    console.log('auth redirect', token);
    var token = req.user.token;
    // res.redirect("http://localhost:3000?token=" + token);
    console.log('req body: ', req.body, ', token: ', token);
    // Successful authentication, redirect home.
    // res.redirect('/secrets');
  });

router.get("/google/login/success", (req, res) => {
  console.log("/google/login/success", 'req.body: ', req.body, 'req.user: ', req.user);
  if (req.user) {
    res.json({
      success: true,
      message: "google user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});


router.get("/google/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

router.get("/google/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// app.post("/api/v1/auth/google", async (req, res) => {
// 	console.log('auth google CLIENT_ID: ', process.env.CLIENT_ID);
// 	// const client = new OAuth2Client(process.env.CLIENT_ID);
//   const {
//     token
//   } = req.body
// 	console.log('auth google req body: ', req.body);
//   const ticket = await client.verifyIdToken({
//     idToken: token,
//     audience: process.env.CLIENT_ID
//   });
//   const {
//     name,
//     email,
//     picture
//   } = ticket.getPayload();
//   const user = await User.findByIdAndUpdate({
//     where: {
//       email: email
//     },
//     update: {
//       name,
//       picture
//     },
//     create: {
//       name,
//       email,
//       picture
//     }
//   })
//   console.log('google user: ', user);
//   res.status(201);
//   res.json(user);
// })




module.exports = router;

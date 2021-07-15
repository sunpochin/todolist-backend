//jshint esversion: 9

const router = require("express").Router();
const passport = require("passport");
const {
  OAuth2Client
} = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID);

const User = require("../../models/user.js");
const usersController = require('../../controllers/users-controllers');

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

// // When logout, redirect to
// router.get("/twitter/logout", (req, res) => {
//   console.log('/logout ', req.body);
//   req.logout();
//   res.redirect(CLIENT_HOME_PAGE_URL);
// });

// auth with twitter
router.get("/twitter", passport.authenticate("twitter"));

// redirect to home page after successfully login via twitter
// router.get(
//   "/twitter/redirect",
//   passport.authenticate("twitter", {
//     successRedirect: CLIENT_HOME_PAGE_URL,
//     failureRedirect: "/auth/login/failed"
//   })
// );

// https://blog.prototypr.io/how-to-build-google-login-into-a-react-app-and-node-express-api-821d049ee670
router.post("/google", async (req, res) => {
  await usersController.signupBody("google", req, res);
  // [user, msg] = await usersController.createUser(email);
  // console.log("user ret: ", msg, ", user:", user);
  // // console.log("haha create user: ", user);
  // res.status(201).json({
  //   user: user,
  //   msg: msg
  // });
});

router.get('/google',
  passport.authenticate('google', {
    // session: false,
    scope: ['profile', 'email']
  }));

router.get('/google/redirect',
  passport.authenticate('google', {
    // session: false,
    successRedirect: process.env.CLIENT_HOME_PAGE_URL,
    failureRedirect: process.env.CLIENT_HOME_PAGE_URL
  }),
  function(req, res) {
    var token = authService.signToken(req, res);
    console.log('****Auth REDIRECT****, req body: ', req.status, req.authInfo);
    console.log('****Auth REDIRECT****, token: ', token);
    let jsonitem = {
      token
    };
    res.redirect("/list");
    // res.redirect("/api?token=" + token);
    // // Successful authentication, redirect home.
    // res.redirect('/secrets');
  });

router.get("/google/login/success", (req, res) => {
  console.log("/google/login/success", 'req.body: ', req.body, 'req.user: ', req.user);
  if (req.user) {
    res.json({
      success: true,
      message: "Google user has successfully authenticated",
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
  res.redirect(process.env.CLIENT_HOME_PAGE_URL);
});


module.exports = router;

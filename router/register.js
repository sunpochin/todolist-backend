//jshint esversion:6
// routes/api/note.js

const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require('../models/Note.js');

router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res, next) {
  const cb = function(err, User) {
    console.log("User: ", User);
    if (err) {
      console.log("cb err: ", err);
      res.json({
        success: false,
        message: "err" + err,
        user: req.user,
        cookies: req.cookies
      });
      // res.redirect("/register");
    } else {
      console.log("cb else: ", User);
      passport.authenticate('local', function(err, User, info) {
        console.log("in passport User: ", User);
        if (err) {
          return next(err);
        }
        // if (!user) {
        //   return res.redirect('/login');
        // }
        req.logIn(User, function(err) {
          if (err) {
            return next(err);
          }
          res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
          });
        });
      })(req, res, next);
    }
  };

  const username = req.body.username;
  const passw = req.body.password;
  console.log('passw: ', passw);
  console.log('req.body: ', req.body, 'passw: ', passw);
  User.register({
    username: username
  }, req.body.password, cb);
});

router.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log('login error:', err);
      res.json("login error.", err);
    } else {
      console.log('login user: ', user);  
      passport.authenticate("local")(req, res, function() {
        console.log('req.user: ', req.user);
        console.log("in passport user: ", user);
        if (err) {
          res.json({error: err});
        }
        req.logIn(user, function(err) {
          if (err) {
            res.json({error: err});
          }
          res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
          });
        });
      });
    }
  });
});


router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

router.get('/auth/google/secrets',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

router.get("/login", function(req, res) {
  res.render("login");
});



router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});


router.get("/submit", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

router.post("/submit", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

router.get("/secrets", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});


module.exports = router;

//jshint esversion: 9
const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user");
const keys = require("../config/keys");
passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
//
//

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.TWITTER_CONSUMER_KEY,
      consumerSecret: keys.TWITTER_CONSUMER_SECRET,
      callbackURL: "/v1/auth/twitter/redirect"
    },
    async (token, tokenSecret, profile, done) => {
      console.log('strategy log, token: ', token, ', tokenSecret: ', tokenSecret, ', profile: ', profile, ', done: ', done);
      // find current user in UserModel
      const currentUser = await User.findOne({
        twitterId: profile._json.id_str
      });
      // create new user if the database doesn't have this user
      if (!currentUser) {
        const newUser = await new User({
          name: profile._json.name,
          screenName: profile._json.screen_name,
          twitterId: profile._json.id_str,
          profileImageUrl: profile._json.profile_image_url
        }).save();
        if (newUser) {
          done(null, newUser);
        }
      }
      done(null, currentUser);
    }
  )
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
    console.log('oauth refreshToken', refreshToken);
    console.log('done: ', done);

    User.findOrCreate({
      // googleId: profile.id,
			email: profile._json.email
    }, function(err, user) {
      console.log("findOrCreate err: ", err);
      return done(err, user, "abcxxx", "defyyy");
    });
    // var userData = {
    //     name: profile.displayName,
    //     token: accessToken
    //    };
    // done(null, userData);
  }
));

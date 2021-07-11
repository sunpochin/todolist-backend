//jshint esversion: 9
const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const keys = require("../config/keys");
const User = require("./models/user");

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


passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.TWITTER_CONSUMER_KEY,
      consumerSecret: keys.TWITTER_CONSUMER_SECRET,
      callbackURL: "/v1/auth/twitter/redirect"
    },
    async (token, tokenSecret, profile, done) => {
      console.log('V1 strategy log, token: ', token, ', tokenSecret: ', tokenSecret, ', done: ', done);
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


passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.TWITTER_CONSUMER_KEY,
      consumerSecret: keys.TWITTER_CONSUMER_SECRET,
      callbackURL: "/v1/auth/twitter/redirect"
    },
    async (token, tokenSecret, profile, done) => {
      console.log('V1 strategy log, token: ', token, ', tokenSecret: ', tokenSecret, ', done: ', done);
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


passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.TWITTER_CONSUMER_KEY,
      consumerSecret: keys.TWITTER_CONSUMER_SECRET,
      callbackURL: "/v2/auth/twitter/redirect"
    },
    async (token, tokenSecret, profile, done) => {
      console.log('twitter V2 strategy log, token: ', token, ', tokenSecret: ', tokenSecret, ', done: ', done);
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

// const {
//   OAuth2Client
// } = require('google-auth-library');
// const client = new OAuth2Client(process.env.CLIENT_ID);

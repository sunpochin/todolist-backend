//jshint esversion:9

//https://stackoverflow.com/questions/29320201/error-installing-bcrypt-with-npm
const {
  OAuth2Client
} = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID);

const {
  validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    users: users.map((user) => user.toObject({
      getters: true
    }))
  });
};

const decideUser = async (email, req, res, next) => {
  let existingUser = null;
  try {
    existingUser = await User.findOne({
      email: email
    });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later. " + err,
      500
    );
    // console.log("next: ", next);
    // if (undefined !== next) {
    //   return next(error);
    // }
  }
  return existingUser;
};

async function createUser(email, hashedPassword) {
  console.log("createUser email: ", email, hashedPassword);
  let msg;
  let createdUser;
  try {
    createdUser = new User({
      email,
      // image: req.file.path,
      password: hashedPassword,
      todos: [],
    });
    msg = "User created, password: " + hashedPassword;
    await createdUser.save();
  } catch (err) {
    msg = "create user error: " + err;
    // const error = new HttpError(errMsg, 500);
    // return next(error);
  }
  return [createdUser, msg];
}


const signupBody = async (from, req, res, next) => {
  console.log("from: ", from, ", req.body: ", req.body);
  let email, password, retUser, retMsg;
  if ("manual" === from) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data." + errors, 422)
      );
    }
    [email, password] = req.body;
  } else if ("google" === from) {
    const {
      token
    } = req.body;
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
    });

    email = ticket.getPayload().email;
    console.log("ticket: ", ticket, ", email: ", email);
  }

  const existingUser = await decideUser(email, req, res, next);
  if (existingUser) {
    retUser = existingUser;
  }

  if ("manual" === from) {
    if (retUser) {
      const errmsg = "User exists already, please login instead: " + existingUser;
      console.log(errmsg);
      res
        .status(422)
        .json({
          error: errmsg,
          email: existingUser.email
        });
      return;
    }
  } else if ("google" === from) {
    // retUser
  }


  let hashedPassword = "A4oVCfspDvzxwGiKhHytwoqo45r4jRWFXcFGT01Bdxv_ggbsRvlDXzE5l5_CzhUHlcG2AJKYj1lCReaN";
  try {
    const salt = 12;
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again." + err,
      500
    );
    // return next(error);
  }

  if (!retUser) {
    [retUser, retMsg] = await createUser(email, hashedPassword);
  }

  let token;
  try {
    token = jwt.sign({
        userId: retUser.id,
        email: retUser.email
      },
      "dontshare", {
        expiresIn: "1h"
      }
    );
    console.log("jwt.sign token");
  } catch (err) {
    const errMsg = "Signing up failed: " + err;
    const error = new HttpError(errMsg, 500);
    return next(error);
  }
  const resItem = {
    from: from,
    msg: retMsg,
    userId: retUser.id,
    email: retUser.email,
    token: token
  };
  console.log('res Item: ', resItem);
  res
    .status(201)
    .json(resItem);
};

const signup = async (req, res, next) => {
  await signupBody("manual", req, res, next);
};

const login = async (req, res, next) => {
  console.log("login req: ", req.body);
  const {
    email,
    password
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email
    });
  } catch (err) {
    const errMsg = "errmsg: " + err;
    const error = new HttpError(
      errMsg,
      500
    );
    return next(error);
  }

  if (!existingUser) {
    // const error = new HttpError(
    //   "Invalid credentials, could not log you in.",
    //   401
    // );
    // next(error);
    const errmsg = 'user not exist';
    console.log(errmsg);
    res
      .status(401)
      .json({
        error: errmsg,
      });
    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const errmsg = 'password error: ' + err;
    console.log(errmsg);
    res
      .status(500)
      .json({
        msg: errmsg,
      });
    return;
  }

  if (!isValidPassword) {
    const errmsg = 'wrong password';
    res.status(403).json({
      msg: errmsg,
    });
    console.log('errmsg: ', errmsg);
    return next();
    // const error = new HttpError(
    //   "Invalid credentials, could not log you in. " ,
    //   403
    // );
    // return next(error);
  }

  let token;
  try {
    token = jwt.sign({
        userId: existingUser.id,
        email: existingUser.email
      },
      "dontshare", {
        expiresIn: "1h"
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  console.log('login token: ', token);
  res
    .status(200)
    .json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.signupBody = signupBody;
exports.login = login;

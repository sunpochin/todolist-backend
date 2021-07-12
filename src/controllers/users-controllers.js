//jshint esversion:9

//https://stackoverflow.com/questions/29320201/error-installing-bcrypt-with-npm

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

const decideUser = async(email) => {
  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email
    });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later. " + err,
      500
    );
    return next(error);
  }

  if (existingUser) {
    // const error = new HttpError(
    //   "User exists already, please login instead.",
    //   422
    // );
    // return next(error);
    const errmsg = 'Already existed user';
    console.log(errmsg);
    res
      .status(422)
      .json({
        error: errmsg,
        email: existingUser.email
      });
    return;
  }
};

 async function createUser(email, hashedPassword) {
  const createdUser = new User({
    email,
    // image: req.file.path,
    password: hashedPassword,
    todos: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const errMsg = "Signing up failed: " + err;
    const error = new HttpError(errMsg, 500);
    // return next(error);
  }
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data." + errors, 422)
    );
  }
  const {
    email,
    password
  } = req.body;

  decideUser(email);

  let hashedPassword;
  try {
    const salt = 12;
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again." + err,
      500
    );
    return next(error);
  }

  let newUser = await createUser(email, hashedPassword);

  let token;
  try {
    token = jwt.sign({
        userId: createdUser.id,
        email: createdUser.email
      },
      "dontshare", {
        expiresIn: "1h"
      }
    );
  } catch (err) {
    const errMsg = "Signing up failed: " + err;
    const error = new HttpError(errMsg, 500);
    return next(error);
  }
  // console.log('sign up token: ', token);
  res
    .status(201)
    .json({
      userId: createdUser.id,
      email: createdUser.email,
      token: token
    });
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
exports.login = login;
exports.createUser = createUser;

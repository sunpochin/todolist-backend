//jshint esversion:6

const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();

// const checkAuth = require('../middleware/check-auth');
// router.use(checkAuth);

// router.get('/', usersController.getUsers);

router.post(
  '/signup',
  // fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;

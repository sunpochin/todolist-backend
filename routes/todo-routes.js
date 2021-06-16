//jshint esversion:6

const express = require('express');
const { check } = require('express-validator');

const todoControllers = require('../controllers/todo-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/:pid', todoControllers.getTodoById);
// We are supposed to see any todo of any user, so Don't need to use uid from token here. If we use uid from token, we would only be able to see user's own todo.
router.get('/user/:uid', todoControllers.getTodosByUserId);

router.use(checkAuth);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  todoControllers.createTodo
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  todoControllers.updateTodo
);

router.delete('/:pid', todoControllers.deleteTodo);

module.exports = router;

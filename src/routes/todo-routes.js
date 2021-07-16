//jshint esversion:6

const express = require('express');
const { check } = require('express-validator');

const todoControllers = require('../controllers/todo-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
router.use(checkAuth);

// We are supposed to ONLY see all todos of the logging user, so Need to use uid from token here.
router.get('/list/:uid', todoControllers.getTodosByUserId);
router.get('/:pid', todoControllers.getTodoById);

router.post(
  '/add',
  [
    check('title')
      .not()
      .isEmpty(),
    // check('description').isLength({ min: 5 })
  ],
  todoControllers.createTodo
);

router.patch(
  '/update/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    // check('description').isLength({ min: 5 })
  ],
  todoControllers.updateTodo
);

router.delete('/del/:pid', todoControllers.deleteTodo);

router.post('/setlist', todoControllers.setList);

module.exports = router;

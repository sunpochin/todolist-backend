//jshint esversion:6

const express = require('express');
const { check } = require('express-validator');

const itemControllers = require('../controllers/item-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
router.use(checkAuth);

// We are supposed to ONLY see all todos of the logging user, so Need to use uid from token here.
router.get('/items', itemControllers.getTodosByUserId);
router.get('/list/:uid', itemControllers.getTodosByUserId);
router.get('/:pid', itemControllers.getTodoById);

router.post(
	'/add',
	[
		check('title').not().isEmpty(),
		// check('description').isLength({ min: 5 })
	],
	itemControllers.createTodo
);

router.patch(
	'/update/:pid',
	[
		check('title').not().isEmpty(),
		// check('description').isLength({ min: 5 })
	],
	itemControllers.updateTodo
);

router.delete('/del/:pid', itemControllers.deleteTodo);

router.post('/setlist', itemControllers.setList);

module.exports = router;

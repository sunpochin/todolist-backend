//jshint esversion:6

const express = require('express');
const { check } = require('express-validator');

const itemControllers = require('../controllers/item-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
// router.use(checkAuth);

// We are supposed to ONLY see all todos of the logging user, so Need to use uid from token here.
router.get('/list', itemControllers.getAllItems);
router.get('/deleteall', itemControllers.deleteAllItems);

router.post(
	'/add',
	[
		check('product_id').not().isEmpty(),
		// check('description').isLength({ min: 5 })
	],
	itemControllers.createNewItem
);
router.get(
	'/decrease/:product_id',
	[check('product_id').not().isEmpty()],
	itemControllers.decreaseItem
);
module.exports = router;

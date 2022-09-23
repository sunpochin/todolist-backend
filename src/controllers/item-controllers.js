//jshint esversion:9

const fs = require('fs');
const { dump } = require('dumper.js');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
// const getCoordsForAddress = require("../util/location");
const Item = require('../models/item');
const User = require('../models/user');

const getAllItems = async (req, res, next) => {
	const todoId = req.params.pid;

	let items;
	try {
		items = await Item.find({}, '-password');
	} catch (err) {
		const error = new HttpError(
			'Fetching users failed, please try again later.',
			500
		);
		return next(error);
	}
	console.log('result: ', items);
	res.json({
		items,
		// items: items.map((user) =>
		// 	user.toObject({
		// 		getters: true,
		// 	})
		// ),
	});
};

const deleteAllItems = async (req, res, next) => {
	const todoId = req.params.pid;

	let ret;
	try {
		ret = await Item.deleteMany();
	} catch (err) {
		const error = new HttpError(
			'Deleting items failed, please try again later.',
			500
		);
		return next(error);
	}
	console.log('ret: ', ret);
	res.json({ deleteall: '' });
};

const createNewItem = async (req, res, next) => {
	console.log('createNewItem req.body: ', req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log('errors: ', errors.array());
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	const { title, product_id, owner_id } = req.body;
	let item;
	try {
		const str = { product_id: `${product_id}` };
		console.log('str: ', str);
		item = await Item.findOne(str);
		// console.log('ret: ', item.quantity);
		// if found, quantity+=1
		const sess = await mongoose.startSession();
		sess.startTransaction();
		if (item !== null) {
			const newQuan = parseInt(item.quantity) + 1;
			console.log('newQuan: ', newQuan);

			ret = await item.updateOne({ quantity: `${newQuan}` });

			item = await Item.findOne(str);
			console.log('item !== null: ', item);
		} else {
			item = new Item({
				title,
				product_id,
				quantity: 0,
				// owner_id,
			});
			console.log('createItem: ', item);
			const ret = await item.save({
				session: sess,
			});
			console.log('save: ', ret);
			// user.items.push(createItem);
			// await user.save({
			// 	session: sess,
			// });
		}
		await sess.commitTransaction();
		// if (owner_id.match(/^[0-9a-fA-F]{24}$/))
		// {
		// 	// Yes, it's a valid ObjectId, proceed with `findById` call.
		// 	user = await User.findById(owner_id);
		// 	// user = await User.findById(req.userData.userId);
		// }
		// console.log('user: ', user);
	} catch (err) {
		const errMsg = 'Creating item failed' + err;
		console.log(errMsg);
		const error = new HttpError(errMsg, 500);
		return next(error);
	}
	// let user;
	// if (!user) {
	// 	const error = new HttpError('Could not find user for provided id.', 404);
	// 	return next(error);
	// }
	// console.log(user);
	try {
	} catch (err) {
		const msg = 'Creating item failed: ' + err;
		console.log('msg: ', msg);
		const error = new HttpError(msg, 500);
		return next(error);
	}

	res.status(201).json({
		item,
	});
};

const decreaseItem = async (req, res, next) => {
	console.log('decreaseItem req.body: ', req.params);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log('errors: ', errors.array());
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	const { title, product_id, owner_id } = req.params;
	let item;
	try {
		const str = { product_id: `${product_id}` };
		console.log('str: ', str);
		item = await Item.findOne(str);
		// console.log('ret: ', item.quantity);
		// if found, quantity+=1
		const sess = await mongoose.startSession();
		sess.startTransaction();
		if (item !== null) {
			const newQuan = parseInt(item.quantity) - 1;
			console.log('newQuan: ', newQuan);
			if (newQuan <= 0) {
        ret = await Item.deleteOne(str);
			} else {
				ret = await item.updateOne({ quantity: `${newQuan}` });
				item = await Item.findOne(str);
			}
			console.log('item !== null: ', item);
		} else {
			// user.items.push(createItem);
			// await user.save({
			// 	session: sess,
			// });
		}
		await sess.commitTransaction();
		// if (owner_id.match(/^[0-9a-fA-F]{24}$/))
		// {
		// 	// Yes, it's a valid ObjectId, proceed with `findById` call.
		// 	user = await User.findById(owner_id);
		// 	// user = await User.findById(req.userData.userId);
		// }
		// console.log('user: ', user);
	} catch (err) {
		const errMsg = 'decrease item failed' + err;
		console.log(errMsg);
		const error = new HttpError(errMsg, 500);
		return next(error);
	}
	// let user;
	// if (!user) {
	// 	const error = new HttpError('Could not find user for provided id.', 404);
	// 	return next(error);
	// }
	// console.log(user);
	res.status(201).json({
		item,
	});
};

exports.getAllItems = getAllItems;
exports.createNewItem = createNewItem;
exports.decreaseItem = decreaseItem;
exports.deleteAllItems = deleteAllItems;

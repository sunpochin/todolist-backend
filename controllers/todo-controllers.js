//jshint esversion:6

const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Todo = require("../models/todo");
const User = require("../models/user");

const getTodoById = async (req, res, next) => {
	const todoId = req.params.pid;

	let todo;
	try {
		todo = await Todo.findById(todoId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find a todo.",
			500
		);
		return next(error);
	}

	if (!todo) {
		const error = new HttpError(
			"Could not find todo for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ todo: todo.toObject({ getters: true }) });
};

const getTodosByUserId = async (req, res, next) => {
	const userId = req.params.uid;
	console.log('req.params: ', req.params);

	let userWithTodos;
	try {
		userWithTodos = await User.findById(userId).populate("todos");
		console.log('userWithTodos: ', userWithTodos);
	} catch (err) {
		const error = new HttpError(
			"Fetching todos failed, please try again later. " + err,
			500
		);
		return next(error);
	}

	// if (!todos || todos.length === 0) {
	if (!userWithTodos || userWithTodos.todos.length === 0) {
		return next(
			new HttpError("Could not find todos for the provided user id.", 404)
		);
	}

	res.json({
		todos: userWithTodos.todos.map((todo) =>
			todo.toObject({ getters: true })
		),
	});
};

const createTodo = async (req, res, next) => {
	console.log('req.body: ', req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log('errors: ', errors.array() );
		return next(
			new HttpError("Invalid inputs passed, please check your data." , 422)
		);
	}

	const {title, description, creator} = req.body;
	const createTodo = new Todo({
		title,
		description,
		creator
	});

	console.log('createTodo: ', createTodo);
	let user;
	try {
		user = await User.findById(creator);
		// user = await User.findById(req.userData.userId);
		console.log('creator: ', creator, ', user: ', user);
	} catch (err) {
		console.log("err: ", err);
		const error = new HttpError(
			"Creating todo failed, please try again." + err,
			500
		);
		return next(error);
	}

	if (!user) {
		const error = new HttpError("Could not find user for provided id.", 404);
		return next(error);
	}

	console.log(user);

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createTodo.save({ session: sess });
		user.todos.push(createTodo);
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log("err: ", err);
		const error = new HttpError(
			"Creating todo failed, please try again.",
			500
		);
		return next(error);
	}

	res.status(201).json({ todo: createTodo });
};

const updateTodo = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passed, please check your data.", 422)
		);
	}

	const { title, description } = req.body;
	const todoId = req.params.pid;

	let todo;
	try {
		todo = await Todo.findById(todoId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update todo.",
			500
		);
		return next(error);
	}

	if (todo.creator.toString() !== req.userData.userId) {
		const error = new HttpError(
			"You are not allowed to edit this todo.",
			401
		);
		return next(error);
	}

	todo.title = title;
	todo.description = description;

	try {
		await todo.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update todo.",
			500
		);
		return next(error);
	}

	res.status(200).json({ todo: todo.toObject({ getters: true }) });
};

const deleteTodo = async (req, res, next) => {
	const todoId = req.params.pid;
	console.log('req.params: ', req.params, ', req.userData: ', req.userData);

	let todo;
	try {
		todo = await Todo.findById(todoId).populate("creator");
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not delete todo.",
			500
		);
		return next(error);
	}

	if (!todo) {
		const error = new HttpError("Could not find todo for this id. " + error, 404);
		return next(error);
	}

	if (todo.creator.id !== req.userData.userId) {
		const error = new HttpError(
			"You are not allowed to delete this todo.",
			403
		);
		return next(error);
	}

	// const imagePath = todo.image;

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await todo.remove({ session: sess });
		todo.creator.todos.pull(todo);
		await todo.creator.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not delete todo.",
			500
		);
		return next(error);
	}

	// fs.unlink(imagePath, (err) => {
	// 	console.log(err);
	// });

	res.status(200).json({ message: "Deleted todo." });
};

exports.getTodoById = getTodoById;
exports.getTodosByUserId = getTodosByUserId;
exports.createTodo = createTodo;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;

//jshint esversion:6

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
	title: { type: String, required: true },
	// description: { type: String, required: true },
	product_id: { type: String, required: true },
	// creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	// order: { type: Number, required: true },
	quantity: { type: Number}
});

module.exports = mongoose.model('Todo', itemSchema);

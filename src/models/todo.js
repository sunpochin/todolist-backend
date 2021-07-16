//jshint esversion:6

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  title: { type: String, required: true },
  // description: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  order: { type: Number, required: true },
});

module.exports = mongoose.model('Todo', todoSchema);

//jshint esversion:6
// models/Notes.js
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
});

module.exports = Note = mongoose.model('Note', NoteSchema);

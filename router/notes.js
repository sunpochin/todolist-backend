//jshint esversion:6
// api/notes.js

const express = require('express');
const router = express.Router();

// Load Note model
const Note = require('../models/Note');

// @route GET api/books/test
// @description tests books route
// @access Public
router.get('/test', (req, res) => res.send('book route testing!'));

// @route post api/books
// @description add/save book
// @access Public
router.post('/add', (req, res) => {
  console.log("/add req.body: ", req.body);
  // console.log("res: " );
  Note.create(req.body)
    .then(book => res.json({ id: book._id }))
    .catch(err => res.status(400).json({ error: 'Unable to add note' + err }));
});

// @route GET api/books
// @description Get all books
// @access Public
router.get('/list', (req, res) => {
  console.log("/list, req.body: ", req.body);
  Note.find()
    .then(note => res.json(note))
    .catch(err => res.status(404).json(
      { nobookfound: 'No Notes found' }
    ));
});



router.delete('/:id', (req, res) => {
  Note.findByIdAndRemove(req.params.id, req.body)
    .then(book => res.json({ mgs: "Note entry deleted successfully:" + req.params.id }))
    .catch(err => res.status(404).json({ error: 'No such a book' }));
});


module.exports = router;

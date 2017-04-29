const Message = require('../models/message.js');
const Room = require('../models/room.js');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  Room.find({}, (err, docs) => {
    res.send(docs);
  });
});

router.get('/messages', (req, res) => {
  Message.find({ room: req.query.room }, (err, docs) => {
    res.json(docs);
  });
});


module.exports = router;

const Message = require('../models/message.js');
const Room = require('../models/room.js');
const express = require('express');
// const authentication = require('../middlewares/authentication.js');

const router = express.Router();

// router.use(authentication);

// GET on /api/rooms
// Search for every groups / channels / privates conversations
router.get('/', (req, res) => {
  const { query } = req;
  Room.find({ 'users._id': query.userId, typeOfRoom: query.typeOfRoom })
      .exec((err, rooms) => {
        res.json(rooms);
      });
});

// GET on /api/rooms/messages
// Search for every messages in a conversation
router.get('/messages', (req, res) => {
  Message.find({ room: req.query.room })
      .populate('user room')
      .exec((err, docs) => {
        res.json(docs);
      });
});

// POST on /api/rooms
// Handle the creation of a new group / channel / private conversation
router.post('/', (req, res, next) => {
  const { body } = req;
  const room = new Room({
    name: body.roomName,
    typeOfRoom: body.typeOfRoom,
  });
  room.users.push(body.user);
  room.moderators.push(body.user);
  room.save((err, savedRoom) => {
    res.json({
      room: savedRoom,
    });
  }).catch(err => next(err));
});

module.exports = router;

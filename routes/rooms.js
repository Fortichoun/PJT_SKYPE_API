const Message = require('../models/message.js');
const Room = require('../models/room.js');
const express = require('express');
// const authentication = require('../middlewares/authentication.js');
const co = require('co');

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
router.post('/', (req, res) => {
  const { body } = req;
  co(function* () {
    let room = yield Room.findOne({ name: body.roomName });
    if (!room) {
      room = new Room({
        name: body.roomName,
        typeOfRoom: body.typeOfRoom,
      });
      room.users.push(body.user);
      body.usersInRoom.map(user => room.users.push(user));
      if (body.typeOfRoom !== 'contacts') room.moderators.push(body.user);
      yield room.save();
    }
    res.json(room);
  });
});

// GET on /api/rooms/usersInRoom
// Search for every users in the room
router.get('/usersInRoom', (req, res) => {
  co(function* () {
    const room = yield Room.findOne({ _id: req.query.room });
    yield Room.populate(room, { path: 'users._id' });
    res.json(room);
  });
});

module.exports = router;

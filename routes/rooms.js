const Message = require('../models/message.js');
const Room = require('../models/room.js');
const express = require('express');
// const authentication = require('../middlewares/authentication.js');
const co = require('co');

const router = express.Router();

// router.use(authentication);

// GET on /api/rooms
// Search for every groups / channels
router.get('/', (req, res) => {
  const { query } = req;
  co(function* () {
    let rooms = null;
    if (query.typeOfRoom === 'channels') {
      rooms = yield Room.find({ typeOfRoom: query.typeOfRoom });
      //     {
      //   sort: { 'users._id': '591240fb49e77e1414484a48' },
      // });
    } else if (query.typeOfRoom === 'groups') {
      rooms = yield Room.find({ 'users._id': query.userId, typeOfRoom: query.typeOfRoom });
    }
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
    const users = [body.user];
    body.usersInRoom.map(user => users.push(user));
    let room = yield Room.findOne({ typeOfRoom: body.typeOfRoom, 'users._id': { $all: users } });
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

// POST on /api/rooms/quit
// Handle the quitting of a room
router.post('/quit', (req, res) => {
  const { body } = req;
  co(function* () {
    const room = yield Room.findOne({ _id: body.roomId });
    room.users.pull({ _id: body.userId });
    if (room.moderators.find(user => user._id.toString() === body.userId.toString())) { room.moderators.pull({ _id: body.userId }); }
    room.save();
    yield Room.populate(room, { path: 'users._id' });
    res.json(room);
  });
});


// POST on /api/rooms/addContact
// Is called when a user is invited in a room
router.post('/addContact', (req, res) => {
  const { body } = req;
  co(function* () {
    const room = yield Room.findOne({ _id: body.roomId });
    if (!room.users.find(user => user._id.toString() === body.contactId.toString())) {
      room.users.push({ _id: body.contactId });
    }
    room.save();
    yield Room.populate(room, { path: 'users._id' });
    res.json(room);
  });
});

module.exports = router;

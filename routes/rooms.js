const Message = require('../models/message.js');
const Room = require('../models/room.js');
const express = require('express');
// const authentication = require('../middlewares/authentication.js');

const router = express.Router();

// router.use(authentication);

router.get('/', (req, res) => {
  const { query } = req;
  Room.find({ 'users._id': query.userId, typeOfRoom: query.typeOfRoom })
      .exec((err, rooms) => {
        res.json(rooms);
      });
});

router.get('/messages', (req, res) => {
  Message.find({ room: req.query.room })
      .populate('user room')
      .exec((err, docs) => {
        res.json(docs);
      });
});

router.post('/', (req, res, next) => {
  const { body } = req;
  const room = new Room({
    name: body.roomName,
    typeOfRoom: body.typeOfRoom,
  });
  room.users.push(body.user);
  room.save((err, savedRoom) => {
    res.json({
      room: savedRoom,
    });
  }).catch(err => next(err));
});

module.exports = router;

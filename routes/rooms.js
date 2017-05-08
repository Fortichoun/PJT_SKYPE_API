const Message = require('../models/message.js');
const Room = require('../models/room.js');
const express = require('express');
// const authentication = require('../middlewares/authentication.js');

const router = express.Router();

// router.use(authentication);

router.get('/', (req, res) => {
  Room.find({}, (err, docs) => {
    res.json(docs);
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
  });
  room.users.push(body.user);
  room.save((err, savedRoom) => {
    res.json({
      room: savedRoom,
    });
  }).catch(err => next(err));
});

module.exports = router;

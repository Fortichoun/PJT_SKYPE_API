const mongoose = require('mongoose');
const Message = require('../models/message.js');

const Schema = mongoose.Schema;

const Room = new Schema({
  name: String,
  users: [{
    _id: String,
  }],
}, {
  collection: 'rooms',
  versionKey: false,
});

Object.assign(Room.statics, {
  getMessages(room) {
    return Message.find({ room })
                .sort('createdAt') || [];
  },
});

module.exports = mongoose.model('Room', Room);

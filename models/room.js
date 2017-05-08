const mongoose = require('mongoose');
// const Message = require('../models/message.js');

const Schema = mongoose.Schema;

const Room = new Schema({
  name: String,
  users: [{
    _id: Schema.Types.ObjectId,
  }],
  moderators: [{
    _id: Schema.Types.ObjectId,
  }],
  bannedUsers: [{
    _id: Schema.Types.ObjectId,
  }],
  typeOfRoom: String,
  createdAt: {
    default: new Date(),
    type: Date,
  },
}, {
  collection: 'rooms',
  versionKey: false,
});

// Object.assign(Room.statics, {
//   getMessages(room) {
//     return Message.find({ room })
//                 .sort('createdAt') || [];
//   },
// });

module.exports = mongoose.model('Room', Room);

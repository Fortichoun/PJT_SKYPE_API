const mongoose = require('mongoose');
const User = require('../models/user.js');

const Schema = mongoose.Schema;

const Room = new Schema({
  name: String,
  users: [{
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
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


// Object.assign(Room.statics, {
  // * getGroupsById(userId, typeOfRoom) {
  //   yield this.find({ 'users._id': userId, typeOfRoom }, (err, rooms) => {
  //     console.log(rooms);
  //     return rooms;
  //   });
            // .sort('createdAt') || [];
    // console.log(test);
    // return test;
//     },
// });

module.exports = mongoose.model('Room', Room);

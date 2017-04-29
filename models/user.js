const mongoose = require('mongoose');
const Room = require('./room.js');

const Schema = mongoose.Schema;

const User = new Schema({
  firstName: String,
  lastName: String,
  email: String,
    // @TODO SEE HASHED PASSWORD ON HU
  password: String,
  profilePicture: {
    _id: String,
  },
  settings: {
    something: Boolean,
  },
  birthDate: Date,
  bio: String,
  contacts: [{
    _id: String,
  }],
  groups: [{
    _id: String,
    canJoin: Boolean,
  }],
  channels: [{
    _id: String,
  }],
  status: String,
  hasBeenInvited: [{
    _id: String,
  }],
  registrationDate: {
    default: new Date(),
    type: Date,
  },
}, {
  collection: 'users',
  versionKey: false,
});

Object.assign(User.methods, {
  getRooms(user) {
    return Room.find({ users: user })
                .sort('createdAt') || [];
  },
});

module.exports = mongoose.model('User', User);

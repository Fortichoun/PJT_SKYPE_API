const mongoose = require('mongoose');
const Room = require('./room.js');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
// const plainPasswordSymbol = Symbol('plainPassword');
const saltRounds = 10;

const User = new Schema({
  userName: String,
  // lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: String,
  profilePicture: {
    _id: String,
  },
  settings: {
    something: Boolean,
  },
  dateOfBirth: Date,
  bio: String,
  contacts: [{
    _id: Schema.Types.ObjectId,
  }],
  status: String,
  friendRequestSent: [{
    _id: Schema.Types.ObjectId,
  }],
  friendRequestReceived: [{
    _id: Schema.Types.ObjectId,
  }],
  registrationDate: {
    default: new Date(),
    type: Date,
  },
}, {
  collection: 'users',
  versionKey: false,
});

// User.index({ email: 'text' }, { unique: true });

User.virtual('password')
    .set(function (password) {
      if (!password) {
        return;
      }
        // this[plainPasswordSymbol] = password;
      this.hashedPassword = bcrypt.hashSync(password, saltRounds);
    })
    .get(function () { return this.hashedPassword; });

Object.assign(User.methods, {
  getRooms(user) {
    return Room.find({ users: user })
                .sort('createdAt') || [];
  },
  isRightPassword(password) {
    return bcrypt.compareSync(password, this.hashedPassword);
  },
});

module.exports = mongoose.model('User', User);

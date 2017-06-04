const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
// const plainPasswordSymbol = Symbol('plainPassword');
const saltRounds = 10;

const User = new Schema({
  userName: String,
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
  birthDate: Date,
  bio: {
    type: String,
    default: '',
  },
  contacts: [{
    _id: {
      type: Schema.Types.ObjectId,
    },
    ref: this,
  }],
  status: String,
  friendRequestSent: [{
    _id: {
      type: Schema.Types.ObjectId,
    },
    ref: this,
  }],
  friendRequestReceived: [{
    _id: {
      type: Schema.Types.ObjectId,
    },
    ref: this,
  }],
  friendRequestRefused: [{
    _id: {
      type: Schema.Types.ObjectId,
    },
    ref: this,
  }],
  registrationDate: {
    default: new Date(),
    type: Date,
  },
}, {
  collection: 'users',
  versionKey: false,
});

// Handle the hash of user's password
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
    // Confront plain text password (when user log in) with hashed db's password
  isRightPassword(password) {
    return bcrypt.compareSync(password, this.hashedPassword);
  },
});

module.exports = mongoose.model('User', User);

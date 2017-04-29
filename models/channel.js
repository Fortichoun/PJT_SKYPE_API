const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Channel = new Schema({
  name: String,
  users: [{
    _id: String,
  }],
  moderators: [{
    _id: String,
  }],
  bannedUsers: [{
    _id: String,
  }],
  createdAt: {
    default: new Date(),
    type: Date,
  },
}, {
  collection: 'channels',
  versionKey: false,
});

module.exports = mongoose.model('Channel', Channel);

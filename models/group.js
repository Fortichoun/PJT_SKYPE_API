const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Group = new Schema({
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
  collection: 'groups',
  versionKey: false,
});

module.exports = mongoose.model('Group', Group);

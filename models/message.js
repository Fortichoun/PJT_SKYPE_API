const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Message = new Schema({
  // user: {
  //   _id: String,
  // },
  user: String,
  room: String,
  //   room: {
  //   _id: String,
  // },
  content: String,
  createdAt: {
    default: new Date(),
    type: Date,
  },
}, {
  collection: 'messages',
  versionKey: false,
});


module.exports = mongoose.model('Message', Message);

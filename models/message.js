const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Message = new Schema({

  content: String,
}, {
  collection: 'messages',
});

module.exports = mongoose.model('Message', Message);
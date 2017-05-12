const Message = require('../models/message.js');
const User = require('../models/user.js');

// Socket IO
// Handle reception of a new message & send back this message to front-end
module.exports = (io, next) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('newMessage', (data) => {
      const message = new Message({
        user: data.user,
        content: data.message,
        room: data.room,
        createdAt: data.createdAt,
      });
      message.save((err, savedMessage) => {
        User.findOne({ _id: savedMessage.user }, (error, user) => {
          savedMessage.user = user;
        }).then(() => {
          io.emit('messageCreated', savedMessage);
        });
      }).catch(e => next(e));
    });
  });
};


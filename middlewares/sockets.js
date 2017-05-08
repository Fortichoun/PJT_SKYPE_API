const Message = require('../models/message.js');
const User = require('../models/user.js');

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
        created: new Date(),
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


const Message = require('../models/message.js');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // const defaultRoom = { name: 'Default Rooooom' };
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    // socket.on('newUser', (user, data) => {
    //   data.room = defaultRoom;
    //   socket.join(defaultRoom);
    // });
    socket.on('newMessage', (data) => {
      //  Create message
      const message = new Message({
        user: data.user,
        content: data.message,
        room: data.room,
        created: new Date(),
      });
      message.save((err, msg) => {
        console.log(msg);
        io.emit('messageCreated', msg);
      });
    });
  });
};


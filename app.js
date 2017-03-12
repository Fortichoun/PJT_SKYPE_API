const http = require('http');
const io = require('socket.io')

const server = http.createServer((req, res) => {
  console.log('A client just connected');
});

// const io = require('socket.io').listen(server);

// io.set('log level', 1);

server.listen(1337);

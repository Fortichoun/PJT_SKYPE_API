const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const config = require('./services/config.js');
const sockets = require('./middlewares/sockets.js');

const app = express();
const server = new http.Server(app);
const io = socketIo(server);
sockets(io);

app.use(cors());
app.options('*', cors());

function listen() {
  server.listen(config.get('port'));
  console.log(`Server listening on port ${config.get('port')}`);
}

// Database connection
function connect() {
  const options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.get('mongodb:uri'), options).connection;
}

connect()
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);


app.use('/quotes', require('./routes/index.js'));


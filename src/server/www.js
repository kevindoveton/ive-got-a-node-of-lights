const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../views/pug'));

server.listen(3000);
app.use('/common/', express.static(path.join(__dirname, '../views/')))

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/sound', function (req, res) {
  res.render('sound');
});

app.get('/cp', function (req, res) {
  res.render('cp');
});

io.on('connection', function (socket) {
  socket.emit('change', { c : '#33ff8b' });
  socket.on('change', function (data) {
    io.sockets.emit('change', data);
    console.log(data);
  });
});

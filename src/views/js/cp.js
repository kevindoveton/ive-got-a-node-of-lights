var socket = io.connect();

function red() {
  console.log('red')
  socket.emit('change', {c: '#ff0000'});
}

function blue() {
  socket.emit('change', { c: '#00ff00' });
}

function green() {
  socket.emit('change', { c: '#0000ff' });
}
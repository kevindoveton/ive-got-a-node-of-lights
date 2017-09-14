var socket = io.connect();
socket.on('change', function (data) {
  document.querySelector('body').style.background = data.c;
});
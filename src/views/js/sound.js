var CONFIG = {
  threshold: 80,
  sourceFreq: 19500
}

var colour = 'blue';


function findFrequency(freq, sampleRate, fftSize) {
  return Math.round(freq / (sampleRate / fftSize)) || 0;
}


document.addEventListener('DOMContentLoaded', function () {

  var socket = io.connect();

  socket.on('change', function (data) {
    colour = data.c || 'blue';
  });

  // get audio context - check for webkit
  var context;
  if (typeof AudioContext !== "undefined") {
    context = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    context = new webkitAudioContext();
  } else {
    alert('Get a newer browser!');
    return;
  }

  var soundAllowed = function(stream) {
    //Audio stops listening in FF without // window.persistAudioStream = stream;
    //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
    //https://support.mozilla.org/en-US/questions/984179
    window.persistAudioStream = stream;

    var analyser = context.createAnalyser();

    var source = context.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 1024;

    var sourceArrayNum = findFrequency(CONFIG.sourceFreq, context.sampleRate, analyser.fftSize)

    var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

    var trigger = {
      first: false,
      time: 0
    }

    function loop() {
      analyser.getByteFrequencyData(frequencyArray);
      // console.log(frequencyArray)
      if (frequencyArray[sourceArrayNum] > CONFIG.threshold) {
        if (trigger.first == false) {
          trigger.first = true;
          trigger.time = new Date().getTime();
        } else {
          if (trigger.first && new Date().getTime() > trigger.time + 25 ) {
            document.querySelector('body').style.background = colour;
            trigger.first = false;
          }
        }
      } else {
        if (trigger.first && new Date().getTime() > trigger.time + 150){
          trigger.first = false;
        }
      }
      setTimeout(loop, 25);
    }

    loop();

  }

  var soundNotAllowed = function() {
    alert('please allow access to your microphone');
  }

  navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);

})
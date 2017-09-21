var CONFIG = {
  threshold: 80,
  sourceFreq: 19500,
  waitTime: 50
}

var colour = 'blue';

var seqPos = 0;
var seq = [
  '#db1c88',
  '#a514e8',
  '#5215d6'
]


function findFrequency(freq, sampleRate, fftSize) {
  return Math.round(freq / (sampleRate / fftSize)) || 0;
}




document.querySelector('body').style.background = 'black';

var socket = io.connect();

socket.on('change', function (data) {
  colour = data.c || '#000000';
});

// get audio context - check for webkit
var context;
if (typeof AudioContext !== "undefined") {
  context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
  context = new webkitAudioContext();
} else {
  alert('Get a newer browser!');
}


var n = navigator.mediaDevices.getUserMedia({
  audio: true,
  video: false
}).then(function(stream) {
  //Audio stops listening in FF without // window.persistAudioStream = stream;
  //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
  //https://support.mozilla.org/en-US/questions/984179
  window.persistAudioStream = stream;

  var analyser = context.createAnalyser();
  console.log(stream.getAudioTracks())
  var source = context.createMediaStreamSource(stream);
  source.connect(analyser);
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0;

  var sourceArrayNum = findFrequency(CONFIG.sourceFreq, context.sampleRate, analyser.fftSize)

  var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

  var trigger = {
    first: false,
    time: 0
  }

  function loop() {
    analyser.getByteFrequencyData(frequencyArray);
    var curTime = new Date().getTime();

    if (frequencyArray[sourceArrayNum] > CONFIG.threshold) {

      // we are hitting the first trigger
      if (trigger.first == false) {
        if (curTime > trigger.time + 25) {
          trigger.first = true;
          trigger.time = curTime;
          console.log(curTime, ' first')
        }
      } else {
        // first trigger has happened, check if time for second
        if (curTime > trigger.time + 100) {
          // time for second
          console.log('hit second')
          document.querySelector('body').style.background = seq[seqPos];
          seqPos = (seqPos + 1) == seq.length ? 0 : seqPos + 1;
          trigger.first = false;
          trigger.time = curTime;
        } else {
          // before second
          console.log(curTime, 'noo')
        }
      }
    } else {
      if (trigger.first && curTime > trigger.time + 150) {
        console.log(curTime, ' end')
        trigger.first = false;
      } else {
        // console.log(curTime, ' no')
      }
    }
    setTimeout(loop, 10);
  }

  loop();
}).catch(function() {
  alert('please allow access to your microphone');
})

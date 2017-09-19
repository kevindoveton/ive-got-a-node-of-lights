document.addEventListener('DOMContentLoaded', function () {

  // Future-proofing...
  var context;
  if (typeof AudioContext !== "undefined") {
    context = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    context = new webkitAudioContext();
  } else {
    alert('Get a newer browser!');
    return;
  }

  // Overkill - if we've got Web Audio API, surely we've got requestAnimationFrame. Surely?...
  // requestAnimationFrame polyfill by Erik M�ller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
      || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };

  // Create the analyser
  var analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  // Get the frequency data and update the visualisation
  function update() {
    requestAnimationFrame(update);

    analyser.getByteFrequencyData(frequencyData);
    // for (var i = 0; i < frequencyData.length; i++) {
    //   // if (frequencyData[i] != 0) {
    //   //   console.log(i, frequencyData[i]);
    //   // }
    // }

    // freq = N * samplerate/fftSize
    // freq * sample / fft =  n
    // 300 * 44100 / 2048
    // 13

    console.log(frequencyData)
  };

  // create Oscillator node
  var oscillator = context.createOscillator();
  var volume = context.createGain();
  volume.connect(analyser);
  volume.gain.value = 100;
  oscillator.type = 'sine';
  oscillator.frequency.value = 20000; // value in hertz
  oscillator.connect(volume);

  oscillator.start();


  // analyser.connect(context.destination);




  // Kick it off...
  update();


});











var soundAllowed = function (stream) {
  //Audio stops listening in FF without // window.persistAudioStream = stream;
  //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
  //https://support.mozilla.org/en-US/questions/984179
  window.persistAudioStream = stream;

  var audioContent = new AudioContext();
  var audioStream = audioContent.createMediaStreamSource(stream);
  var analyser = audioContent.createAnalyser();
  audioStream.connect(analyser);
  analyser.fftSize = 1024;

  var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
  visualizer.setAttribute('viewBox', '0 0 255 255');

  //Through the frequencyArray has a length longer than 255, there seems to be no
  //significant data after this point. Not worth visualizing.
  for (var i = 0; i < 255; i++) {
    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-dasharray', '4,1');
    mask.appendChild(path);
  }
  var doDraw = function () {
    requestAnimationFrame(doDraw);
    analyser.getByteFrequencyData(frequencyArray);
    var adjustedLength;
    for (var i = 0; i < 255; i++) {
      adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
      paths[i].setAttribute('d', 'M ' + (i) + ',255 l 0,-' + adjustedLength);
    }

  }
  doDraw();
}

var soundNotAllowed = function (error) {
  h.innerHTML = "You must allow your microphone.";
  console.log(error);
}

/*window.navigator = window.navigator || {};
/*navigator.getUserMedia =  navigator.getUserMedia       ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia    ||
                          null;*/
navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);
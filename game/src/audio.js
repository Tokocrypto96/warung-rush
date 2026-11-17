'use strict';
/* Warung Rush — tiny synth SFX: WebAudio oscillators, no audio files. */

var WR_AUDIO = (function () {
  var ctx = null;
  var muted = false;

  function ensure() {
    if (!ctx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC();
      } catch (e) {
        ctx = null;
      }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, delay) {
    var ac = ensure();
    if (!ac || muted) return;
    var t0 = ac.currentTime + (delay || 0);
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noiseBurst(dur, vol) {
    var ac = ensure();
    if (!ac || muted) return;
    var len = Math.floor(ac.sampleRate * dur);
    var buf = ac.createBuffer(1, len, ac.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = ac.createBufferSource();
    src.buffer = buf;
    var gain = ac.createGain();
    gain.gain.value = vol || 0.08;
    var filter = ac.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    src.start();
  }

  var sounds = {
    click: function () { tone(660, 0.06, 'square', 0.06); },
    ding: function () { tone(880, 0.12, 'sine', 0.12); tone(1320, 0.18, 'sine', 0.1, 0.08); },
    cook: function () { noiseBurst(0.25, 0.07); },
    ready: function () { tone(1046, 0.1, 'sine', 0.12); tone(1568, 0.16, 'sine', 0.1, 0.09); },
    serve: function () { tone(784, 0.09, 'triangle', 0.14); tone(1046, 0.09, 'triangle', 0.14, 0.08); tone(1318, 0.16, 'triangle', 0.14, 0.16); },
    wrong: function () { tone(160, 0.18, 'sawtooth', 0.08); },
    angry: function () { tone(220, 0.25, 'sawtooth', 0.1); tone(180, 0.3, 'sawtooth', 0.1, 0.12); },
    clear: function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.18, 'triangle', 0.14, i * 0.11); }); },
    good: function () { tone(660, 0.1, 'triangle', 0.14); tone(990, 0.14, 'triangle', 0.14, 0.08); },
    over: function () { [392, 330, 262, 196].forEach(function (f, i) { tone(f, 0.25, 'triangle', 0.12, i * 0.14); }); }
  };

  return {
    unlock: ensure,
    play: function (name) {
      if (muted) return;
      if (sounds[name]) sounds[name]();
    },
    setMuted: function (m) { muted = m; },
    isMuted: function () { return muted; }
  };
})();

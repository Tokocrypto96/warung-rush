'use strict';
/* Warung Rush — bootstrap + main loop. */

(function () {
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var state = wrNewState();
  wrLoadBest(state);
  wrInitInput(canvas, state);
  window.WR_DEBUG = { state: state };

  var last = performance.now();

  function update(dt) {
    if (state.screen !== 'playing' || state.paused) return;
    var cfg = wrDayConfig(state.day);
    state.timer -= dt;
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      if (wrSpawnCustomer(state)) WR_AUDIO.play('ding');
      state.spawnTimer = cfg.spawnEvery * (0.85 + Math.random() * 0.3);
    }
    wrUpdateCustomers(state, dt);
    var readyBefore = state.tray.length;
    wrUpdateKitchen(state, dt);
    if (state.tray.length > readyBefore) WR_AUDIO.play('ready');
    if (state.messageTimer > 0) state.messageTimer -= dt;
    if (state.shake > 0) state.shake -= dt;
    if (state.hearts <= 0) {
      state.screen = 'gameover';
      wrSaveBest(state);
      WR_AUDIO.play('over');
      return;
    }
    if (state.timer <= 0) {
      state.timer = 0;
      if (state.coins >= cfg.target) {
        state.screen = 'dayclear';
        WR_AUDIO.play('clear');
      } else {
        state.screen = 'gameover';
        wrSaveBest(state);
        WR_AUDIO.play('over');
      }
    }
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    wrDrawGame(ctx, state);
    // Debug hook for automated play-testing: exposes state via DOM only.
    canvas.dataset.debug = JSON.stringify({
      screen: state.screen,
      day: state.day,
      coins: state.coins,
      score: state.score,
      hearts: state.hearts,
      combo: state.combo,
      timer: Math.ceil(state.timer),
      bank: state.bank,
      upgrades: state.upgrades,
      tray: state.tray.slice(),
      selected: state.selected,
      servedToday: state.servedToday,
      customers: state.customers.filter(function (c) { return !c.leaving; }).map(function (c) {
        return { order: c.order, table: c.table, patience: Math.ceil(c.patience), vip: !!c.vip };
      })
    });
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
})();

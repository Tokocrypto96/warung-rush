'use strict';
/* Warung Rush — mouse + keyboard input, routed by screen. */

function wrHit(rect, x, y) {
  return rect && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function wrCanvasPoint(canvas, clientX, clientY) {
  var r = canvas.getBoundingClientRect();
  return {
    x: (clientX - r.left) * (WR_CONFIG.canvasWidth / r.width),
    y: (clientY - r.top) * (WR_CONFIG.canvasHeight / r.height)
  };
}

function wrCustomerRect(c) {
  var t = WR_CONFIG.tables[c.table];
  return { x: t.x - 55, y: 85, w: 110, h: 105 };
}

function wrInitInput(canvas, state) {
  canvas.addEventListener('pointerdown', function (ev) {
    WR_AUDIO.unlock();
    var p = wrCanvasPoint(canvas, ev.clientX, ev.clientY);
    wrHandleClick(state, p.x, p.y);
  });

  window.addEventListener('keydown', function (ev) {
    if (ev.repeat) return;
    WR_AUDIO.unlock();
    if (state.screen === 'title' && (ev.key === 'Enter' || ev.key === ' ')) {
      wrStartDay(state, 1);
      WR_AUDIO.play('click');
      return;
    }
    if (state.screen === 'dayclear' && ev.key === 'Enter') {
      wrStartDay(state, state.day + 1);
      WR_AUDIO.play('click');
      return;
    }
    if (state.screen === 'dayclear') {
      var upIdx = ['1', '2', '3'].indexOf(ev.key);
      if (upIdx >= 0 && upIdx < WR_CONFIG.upgrades.length) {
        if (wrBuyUpgrade(state, WR_CONFIG.upgrades[upIdx].id)) WR_AUDIO.play('good');
      }
      return;
    }
    if (state.screen === 'gameover' && (ev.key === 'Enter' || ev.key === 'r' || ev.key === 'R')) {
      wrStartDay(state, 1);
      WR_AUDIO.play('click');
      return;
    }
    if (ev.key === 'm' || ev.key === 'M') {
      state.muted = !state.muted;
      WR_AUDIO.setMuted(state.muted);
      return;
    }
    if (state.screen !== 'playing') return;
    if (ev.key === 'p' || ev.key === 'P' || ev.key === 'Escape') {
      state.paused = !state.paused;
      WR_AUDIO.play('click');
      return;
    }
    if (state.paused) return;
    var idx = ['1', '2', '3', '4'].indexOf(ev.key);
    if (idx >= 0) {
      var def = WR_CONFIG.stations[idx];
      if (wrStartCooking(state, def.id)) WR_AUDIO.play('cook');
    }
  });
}

function wrHandleClick(state, x, y) {
  if (wrHit(WR_UI.buttons.mute, x, y)) {
    state.muted = !state.muted;
    WR_AUDIO.setMuted(state.muted);
    return;
  }
  if (state.screen === 'title') {
    if (wrHit(WR_UI.buttons.start, x, y)) {
      wrStartDay(state, 1);
      WR_AUDIO.play('click');
    }
    return;
  }
  if (state.screen === 'dayclear') {
    if (wrHit(WR_UI.buttons.next, x, y)) {
      wrStartDay(state, state.day + 1);
      WR_AUDIO.play('click');
    }
    WR_CONFIG.upgrades.forEach(function (up) {
      if (wrHit(WR_UI.buttons['up_' + up.id], x, y) && wrBuyUpgrade(state, up.id)) {
        WR_AUDIO.play('good');
      }
    });
    return;
  }
  if (state.screen === 'gameover') {
    if (wrHit(WR_UI.buttons.retry, x, y)) {
      wrStartDay(state, 1);
      WR_AUDIO.play('click');
    }
    return;
  }
  if (state.screen !== 'playing') return;
  if (state.paused) {
    if (wrHit(WR_UI.buttons.resume, x, y)) {
      state.paused = false;
      WR_AUDIO.play('click');
    }
    return;
  }
  // tray slots: select / deselect a ready dish
  for (var i = 0; i < wrTraySize(state); i++) {
    if (wrHit(wrTraySlotRect(state, i), x, y)) {
      if (i < state.tray.length) {
        state.selected = state.selected === i ? -1 : i;
        WR_AUDIO.play('click');
      }
      return;
    }
  }
  // stations: start cooking
  for (var s = 0; s < WR_CONFIG.stations.length; s++) {
    var def = WR_CONFIG.stations[s];
    if (wrHit(def, x, y)) {
      if (wrStartCooking(state, def.id)) WR_AUDIO.play('cook');
      return;
    }
  }
  // customers: serve the selected dish
  for (var c = 0; c < state.customers.length; c++) {
    var cust = state.customers[c];
    if (wrHit(wrCustomerRect(cust), x, y)) {
      if (state.selected < 0) return;
      var result = wrServe(state, cust);
      if (result === 'served') WR_AUDIO.play('serve');
      else if (result === 'wrong') WR_AUDIO.play('wrong');
      return;
    }
  }
  // clicked empty space: deselect
  state.selected = -1;
}

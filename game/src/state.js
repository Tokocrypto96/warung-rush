'use strict';
/* Warung Rush — one object holds the whole game state. */

function wrNewState() {
  return {
    screen: 'title', // title | playing | dayclear | gameover
    paused: false,
    day: 1,
    coins: 0, // coins earned this day
    score: 0, // total coins across all days
    bank: 0, // spendable coins (all earnings, kept across days)
    upgrades: { fastCook: 0, bigTray: 0, extraHeart: 0 },
    hearts: WR_CONFIG.maxHearts,
    combo: 0,
    bestCombo: 0,
    timer: 0, // seconds left in the day
    spawnTimer: 2,
    customers: [],
    stations: WR_CONFIG.stations.map(function (s) {
      return { id: s.id, dishId: s.dishId, cooking: null, flash: 0 };
    }),
    tray: [], // dish ids ready to serve
    selected: -1, // index into tray, -1 = none
    servedToday: 0,
    lostToday: 0,
    shake: 0, // wrong-serve shake timer
    message: '',
    messageTimer: 0,
    muted: false,
    best: 0
  };
}

function wrMaxHearts(state) {
  return WR_CONFIG.maxHearts + state.upgrades.extraHeart;
}

function wrUpgradeCost(id, level) {
  var def = WR_CONFIG.upgrades.find(function (u) { return u.id === id; });
  return def ? def.baseCost * (level + 1) : 0;
}

function wrBuyUpgrade(state, id) {
  var level = state.upgrades[id];
  if (level === undefined || level >= WR_CONFIG.maxUpgradeLevel) return false;
  var cost = wrUpgradeCost(id, level);
  if (state.bank < cost) return false;
  state.bank -= cost;
  state.upgrades[id] = level + 1;
  return true;
}

function wrStartDay(state, day) {
  var cfg = wrDayConfig(day);
  state.day = day;
  state.coins = 0;
  state.hearts = wrMaxHearts(state);
  state.combo = 0;
  state.timer = cfg.duration;
  state.spawnTimer = 1.5;
  state.customers = [];
  state.tray = [];
  state.selected = -1;
  state.servedToday = 0;
  state.lostToday = 0;
  state.shake = 0;
  state.message = '';
  state.messageTimer = 0;
  state.paused = false;
  state.screen = 'playing';
}

function wrLoadBest(state) {
  try {
    state.best = parseInt(window.localStorage.getItem('warung-rush-best') || '0', 10) || 0;
  } catch (e) {
    state.best = 0;
  }
}

function wrSaveBest(state) {
  if (state.score <= state.best) return;
  state.best = state.score;
  try {
    window.localStorage.setItem('warung-rush-best', String(state.best));
  } catch (e) {
    /* storage unavailable — best score just lives for this session */
  }
}

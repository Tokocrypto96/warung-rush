'use strict';
/* Warung Rush — customers: arrive, order, wait, leave happy or angry. */

var wrCustomerId = 0;
var WR_CUSTOMER_COLORS = ['#D96C4A', '#2E7D6B', '#7B5EA7', '#C98A2E', '#4A7FB5', '#B5526B'];
var WR_CUSTOMER_HATS = ['cap', 'band', 'none', 'cap', 'band', 'none'];

function wrFreeTable(state) {
  for (var i = 0; i < WR_CONFIG.tables.length; i++) {
    var taken = state.customers.some(function (c) {
      return c.table === i;
    });
    if (!taken) return i;
  }
  return -1;
}

function wrRandomOrder(day) {
  var pool = WR_CONFIG.menu.filter(function (m) { return wrDishUnlocked(m, day); });
  return pool[Math.floor(Math.random() * pool.length)].id;
}

function wrSpawnCustomer(state) {
  var table = wrFreeTable(state);
  if (table < 0) return false;
  var cfg = wrDayConfig(state.day);
  var n = wrCustomerId++;
  var vip = state.day >= 2 && Math.random() < WR_CONFIG.vipChance;
  state.customers.push({
    id: n,
    table: table,
    order: wrRandomOrder(state.day),
    patience: cfg.patience * (vip ? WR_CONFIG.vipPatience : 1),
    maxPatience: cfg.patience * (vip ? WR_CONFIG.vipPatience : 1),
    vip: vip,
    payMult: vip ? WR_CONFIG.vipPay : 1,
    color: WR_CUSTOMER_COLORS[n % WR_CUSTOMER_COLORS.length],
    hat: WR_CUSTOMER_HATS[n % WR_CUSTOMER_HATS.length],
    bob: Math.random() * Math.PI * 2,
    leaving: null, // null | 'happy' | 'angry'
    leaveTimer: 0
  });
  return true;
}

function wrUpdateCustomers(state, dt) {
  state.customers.forEach(function (c) {
    c.bob += dt * 3;
    if (c.leaving) {
      c.leaveTimer -= dt;
      return;
    }
    c.patience -= dt;
    if (c.patience <= 0) {
      c.patience = 0;
      c.leaving = 'angry';
      c.leaveTimer = 0.9;
      state.hearts -= 1;
      state.combo = 0;
      state.lostToday += 1;
      state.message = 'Pelanggan kabur!';
      state.messageTimer = 1.2;
    }
  });
  state.customers = state.customers.filter(function (c) {
    return !(c.leaving && c.leaveTimer <= 0);
  });
}

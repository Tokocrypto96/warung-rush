'use strict';
/* Warung Rush — kitchen: stations cook, tray holds finished dishes, serving pays. */

function wrTraySize(state) {
  return WR_CONFIG.traySize + 2 * state.upgrades.bigTray;
}

function wrTrayCols(state) {
  return Math.ceil(wrTraySize(state) / 2);
}

function wrTraySlotRect(state, i) {
  var tr = WR_CONFIG.tray;
  var cols = wrTrayCols(state);
  var sw = (tr.w - 16) / cols;
  var col = i % cols;
  var row = Math.floor(i / cols);
  return { x: tr.x + 8 + col * sw, y: tr.y + 30 + row * 40, w: sw - 4, h: 34 };
}

function wrStationDef(id) {
  return WR_CONFIG.stations.find(function (s) { return s.id === id; });
}

function wrStationState(state, id) {
  return state.stations.find(function (s) { return s.id === id; });
}

function wrStartCooking(state, stationId) {
  var def = wrStationDef(stationId);
  var st = wrStationState(state, stationId);
  if (!def || !st || st.cooking) return false;
  var dish = wrDish(def.dishId);
  if (!wrDishUnlocked(dish, state.day)) return false;
  var speed = Math.pow(0.8, state.upgrades.fastCook);
  st.cooking = { dishId: dish.id, t: 0, total: dish.cookTime * speed };
  return true;
}

function wrUpdateKitchen(state, dt) {
  state.stations.forEach(function (st) {
    if (st.flash > 0) st.flash -= dt;
    if (!st.cooking) return;
    st.cooking.t += dt;
    if (st.cooking.t >= st.cooking.total) {
      if (state.tray.length < wrTraySize(state)) {
        state.tray.push(st.cooking.dishId);
      }
      st.cooking = null;
      st.flash = 0.4;
    }
  });
}

function wrServe(state, customer) {
  if (state.selected < 0 || state.selected >= state.tray.length) return 'none';
  var dishId = state.tray[state.selected];
  if (dishId !== customer.order || customer.leaving) {
    state.shake = 0.3;
    return 'wrong';
  }
  var dish = wrDish(dishId);
  var frac = Math.max(0, customer.patience / customer.maxPatience);
  var mult = Math.min(2, 1 + 0.25 * Math.max(0, state.combo));
  var tip = Math.round(dish.price * frac * 0.5 * mult);
  var earn = (dish.price + tip) * customer.payMult;
  state.coins += earn;
  state.score += earn;
  state.bank += earn;
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.servedToday += 1;
  state.tray.splice(state.selected, 1);
  state.selected = -1;
  customer.leaving = 'happy';
  customer.leaveTimer = 0.9;
  state.message = (customer.payMult > 1 ? 'VIP! ' : '') + '+' + earn + ' koin' + (tip > 0 ? ' (tip ' + tip + ')' : '');
  state.messageTimer = 1.0;
  return 'served';
}

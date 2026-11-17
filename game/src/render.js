'use strict';
/* Warung Rush — all drawing: scene, customers, stations, HUD, overlays. */

var WR_UI = { buttons: {} };

function wrRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrButton(ctx, id, x, y, w, h, label, accent) {
  WR_UI.buttons[id] = { x: x, y: y, w: w, h: h };
  ctx.fillStyle = accent || '#2E7D6B';
  wrRoundRect(ctx, x, y, w, h, 12);
  ctx.fill();
  ctx.strokeStyle = '#4A2E1E';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#FFF6E5';
  ctx.font = 'bold ' + (label.length > 10 ? 19 : 24) + 'px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
}

function wrDrawDishIcon(ctx, dishId, cx, cy, r) {
  var dish = wrDish(dishId);
  if (!dish) return;
  ctx.save();
  ctx.translate(cx, cy);
  if (dishId === 'nasi') {
    ctx.fillStyle = '#FFF6E5';
    ctx.beginPath();
    ctx.arc(0, 2, r, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4A2E1E';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = dish.color;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.62, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5FA860';
    ctx.fillRect(-r * 0.4, -r * 0.55, r * 0.25, r * 0.25);
    ctx.fillRect(r * 0.15, -r * 0.6, r * 0.25, r * 0.25);
  } else if (dishId === 'mie') {
    ctx.fillStyle = '#FFF6E5';
    ctx.beginPath();
    ctx.arc(0, 2, r, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4A2E1E';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = dish.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.25, r * 0.35, Math.PI * 1.1, Math.PI * 1.9);
    ctx.arc(r * 0.3, -r * 0.25, r * 0.35, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  } else if (dishId === 'esteh') {
    ctx.fillStyle = '#DFF0F5';
    wrRoundRect(ctx, -r * 0.55, -r * 0.9, r * 1.1, r * 1.7, 4);
    ctx.fill();
    ctx.strokeStyle = '#4A2E1E';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#C98A2E';
    wrRoundRect(ctx, -r * 0.45, -r * 0.2, r * 0.9, r * 0.9, 3);
    ctx.fill();
    ctx.strokeStyle = '#D64545';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(r * 0.25, -r * 0.9);
    ctx.lineTo(r * 0.45, -r * 1.3);
    ctx.stroke();
  } else if (dishId === 'sate') {
    ctx.strokeStyle = '#8A5A2B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.5);
    ctx.lineTo(r * 0.7, -r * 0.5);
    ctx.moveTo(-r * 0.7, r * 0.3);
    ctx.lineTo(r * 0.7, r * 0.3);
    ctx.stroke();
    ctx.fillStyle = dish.color;
    [[-0.45, -0.5], [0, -0.5], [0.45, -0.5], [-0.45, 0.3], [0, 0.3], [0.45, 0.3]].forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p[0] * r, p[1] * r, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}

function wrDrawCustomer(ctx, state, c) {
  var t = WR_CONFIG.tables[c.table];
  var bobY = Math.sin(c.bob) * 2;
  var x = t.x;
  var y = 140 + bobY;
  var alpha = c.leaving ? Math.max(0.35, c.leaveTimer) : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (c.leaving === 'angry') ctx.translate(x + (Math.random() * 4 - 2), y);
  else ctx.translate(x, y);
  // body
  ctx.fillStyle = c.color;
  ctx.beginPath();
  ctx.arc(0, 12, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4A2E1E';
  ctx.lineWidth = 2;
  ctx.stroke();
  // head
  ctx.fillStyle = '#F2C89B';
  ctx.beginPath();
  ctx.arc(0, -16, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // hat
  if (c.hat === 'cap') {
    ctx.fillStyle = '#2E7D6B';
    ctx.beginPath();
    ctx.arc(0, -19, 15, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(-15, -21, 30, 5);
  } else if (c.hat === 'band') {
    ctx.fillStyle = '#F2B705';
    ctx.fillRect(-15, -26, 30, 6);
  }
  // face
  ctx.fillStyle = '#4A2E1E';
  ctx.beginPath();
  ctx.arc(-5, -17, 2, 0, Math.PI * 2);
  ctx.arc(5, -17, 2, 0, Math.PI * 2);
  ctx.fill();
  if (c.leaving === 'angry') {
    ctx.strokeStyle = '#4A2E1E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -8);
    ctx.lineTo(4, -11);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(0, -11, 5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  // VIP crown
  if (c.vip) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#F2B705';
    ctx.beginPath();
    ctx.moveTo(-14, -30);
    ctx.lineTo(-7, -40);
    ctx.lineTo(0, -31);
    ctx.lineTo(7, -40);
    ctx.lineTo(14, -30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4A2E1E';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  // table (in front of body)
  ctx.fillStyle = '#B5651D';
  ctx.beginPath();
  ctx.ellipse(x, 178, 56, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4A2E1E';
  ctx.lineWidth = 2;
  ctx.stroke();
  // order bubble
  if (!c.leaving) {
    var dish = wrDish(c.order);
    var bx = x - 48;
    var by = 62;
    ctx.fillStyle = '#FFFFFF';
    wrRoundRect(ctx, bx, by, 96, 46, 10);
    ctx.fill();
    ctx.strokeStyle = c.vip ? '#F2B705' : '#4A2E1E';
    ctx.lineWidth = c.vip ? 3 : 2;
    ctx.stroke();
    wrDrawDishIcon(ctx, c.order, bx + 22, by + 23, 15);
    ctx.fillStyle = '#4A2E1E';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(dish.short, bx + 42, by + 18);
    ctx.fillStyle = '#888888';
    ctx.font = '11px sans-serif';
    ctx.fillText(dish.price + ' koin', bx + 42, by + 34);
    // patience bar
    var frac = Math.max(0, c.patience / c.maxPatience);
    ctx.fillStyle = '#E0D5C0';
    wrRoundRect(ctx, bx, by + 50, 96, 7, 3);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? '#5FA860' : frac > 0.25 ? '#F2B705' : '#D64545';
    if (frac > 0) {
      wrRoundRect(ctx, bx, by + 50, 96 * frac, 7, 3);
      ctx.fill();
    }
  }
}

function wrDrawStation(ctx, state, def) {
  var st = wrStationState(state, def.id);
  var dish = wrDish(def.dishId);
  var locked = !wrDishUnlocked(dish, state.day);
  ctx.fillStyle = locked ? '#C9BBA6' : '#FFF6E5';
  wrRoundRect(ctx, def.x, def.y, def.w, def.h, 12);
  ctx.fill();
  ctx.strokeStyle = st.flash > 0 ? '#F2B705' : '#4A2E1E';
  ctx.lineWidth = st.flash > 0 ? 4 : 2;
  ctx.stroke();
  ctx.fillStyle = '#4A2E1E';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(def.name, def.x + def.w / 2, def.y + 22);
  if (locked) {
    ctx.fillStyle = '#8A7A66';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Buka Hari 2', def.x + def.w / 2, def.y + 62);
    ctx.font = '11px sans-serif';
    ctx.fillText(dish.name, def.x + def.w / 2, def.y + 84);
    return;
  }
  wrDrawDishIcon(ctx, dish.id, def.x + def.w / 2, def.y + 58, 20);
  if (st.cooking) {
    var frac = st.cooking.t / st.cooking.total;
    ctx.fillStyle = '#E0D5C0';
    wrRoundRect(ctx, def.x + 16, def.y + 88, def.w - 32, 10, 5);
    ctx.fill();
    ctx.fillStyle = '#2E7D6B';
    wrRoundRect(ctx, def.x + 16, def.y + 88, (def.w - 32) * Math.min(1, frac), 10, 5);
    ctx.fill();
  } else {
    ctx.fillStyle = '#8A7A66';
    ctx.font = '12px sans-serif';
    ctx.fillText('Klik / tombol ' + (WR_CONFIG.stations.indexOf(def) + 1), def.x + def.w / 2, def.y + 97);
  }
}

function wrDrawTray(ctx, state) {
  var tr = WR_CONFIG.tray;
  ctx.fillStyle = '#FFF6E5';
  wrRoundRect(ctx, tr.x, tr.y, tr.w, tr.h, 12);
  ctx.fill();
  ctx.strokeStyle = '#4A2E1E';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#4A2E1E';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Nampan', tr.x + tr.w / 2, tr.y + 22);
  var size = wrTraySize(state);
  for (var i = 0; i < size; i++) {
    var slot = wrTraySlotRect(state, i);
    var sx = slot.x;
    var sy = slot.y;
    ctx.fillStyle = state.selected === i ? '#F2B705' : '#EFE3CC';
    wrRoundRect(ctx, sx, sy, slot.w, slot.h, 8);
    ctx.fill();
    ctx.strokeStyle = state.selected === i ? '#4A2E1E' : '#C9BBA6';
    ctx.lineWidth = state.selected === i ? 3 : 1;
    ctx.stroke();
    if (i < state.tray.length) {
      wrDrawDishIcon(ctx, state.tray[i], sx + slot.w / 2, sy + slot.h / 2, Math.min(13, slot.w / 2 - 2));
    }
  }
}

function wrDrawHUD(ctx, state) {
  var P = WR_CONFIG.palette;
  ctx.fillStyle = P.teal;
  ctx.fillRect(0, 0, WR_CONFIG.canvasWidth, 56);
  ctx.fillStyle = '#FFF6E5';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  var cfg = wrDayConfig(state.day);
  ctx.fillText('Hari ' + state.day, 16, 20);
  ctx.font = '16px sans-serif';
  ctx.fillText('Koin ' + state.coins + '/' + cfg.target, 16, 42);
  // hearts
  var maxHearts = wrMaxHearts(state);
  for (var i = 0; i < maxHearts; i++) {
    var hx = 220 + i * 30;
    ctx.fillStyle = i < state.hearts ? '#FF6B6B' : '#5A4A3A';
    ctx.beginPath();
    ctx.arc(hx, 26, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  // timer bar
  var tw = 220;
  var tx = 330;
  ctx.fillStyle = '#1E5A4E';
  wrRoundRect(ctx, tx, 16, tw, 14, 7);
  ctx.fill();
  var tfrac = Math.max(0, state.timer / cfg.duration);
  ctx.fillStyle = tfrac > 0.3 ? '#F2B705' : '#D64545';
  if (tfrac > 0) {
    wrRoundRect(ctx, tx, 16, tw * tfrac, 14, 7);
    ctx.fill();
  }
  ctx.fillStyle = '#FFF6E5';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(Math.ceil(state.timer) + ' dtk', tx, 44);
  // score + combo
  ctx.textAlign = 'right';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Skor ' + state.score, 830, 20);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = state.combo >= 2 ? '#F2B705' : '#FFF6E5';
  ctx.fillText(state.combo >= 2 ? 'Combo x' + Math.min(2, 1 + 0.25 * (state.combo - 1)).toFixed(2).replace(/\.?0+$/, '') + ' (' + state.combo + ')' : 'Combo -', 830, 42);
  // mute button
  WR_UI.buttons.mute = { x: 900, y: 10, w: 44, h: 36 };
  ctx.fillStyle = '#1E5A4E';
  wrRoundRect(ctx, 900, 10, 44, 36, 8);
  ctx.fill();
  ctx.fillStyle = '#FFF6E5';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.muted ? 'X' : '♪', 922, 29);
  // floating message
  if (state.messageTimer > 0) {
    ctx.globalAlpha = Math.min(1, state.messageTimer);
    ctx.fillStyle = '#4A2E1E';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.message, WR_CONFIG.canvasWidth / 2, 340);
    ctx.globalAlpha = 1;
  }
}

function wrDrawOverlay(ctx, state, title, lines, buttonId, buttonLabel, accent) {
  var boxTop = 110;
  var linesTop = 220;
  var boxH = (linesTop - boxTop) + lines.length * 30 + 30;
  ctx.fillStyle = 'rgba(42, 26, 18, 0.72)';
  ctx.fillRect(0, 0, WR_CONFIG.canvasWidth, WR_CONFIG.canvasHeight);
  ctx.fillStyle = '#FFF6E5';
  wrRoundRect(ctx, 210, boxTop, 540, boxH, 18);
  ctx.fill();
  ctx.strokeStyle = '#4A2E1E';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#D96C4A';
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(title, 480, 175);
  ctx.fillStyle = '#4A2E1E';
  ctx.font = '18px sans-serif';
  lines.forEach(function (line, i) {
    ctx.fillText(line, 480, linesTop + i * 30);
  });
  wrButton(ctx, buttonId, 380, boxTop + boxH + 14, 200, 54, buttonLabel, accent);
}

function wrDrawDayClear(ctx, state) {
  ctx.fillStyle = 'rgba(42, 26, 18, 0.72)';
  ctx.fillRect(0, 0, WR_CONFIG.canvasWidth, WR_CONFIG.canvasHeight);
  ctx.fillStyle = '#FFF6E5';
  wrRoundRect(ctx, 210, 70, 540, 440, 18);
  ctx.fill();
  ctx.strokeStyle = '#4A2E1E';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#D96C4A';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Hari ' + state.day + ' Selesai!', 480, 125);
  ctx.fillStyle = '#4A2E1E';
  ctx.font = '18px sans-serif';
  ctx.fillText('Koin hari ini: ' + state.coins + ' (target ' + wrDayConfig(state.day).target + ')', 480, 160);
  ctx.fillText('Pesanan diantar: ' + state.servedToday + ' • Pelanggan kabur: ' + state.lostToday, 480, 188);
  ctx.fillText('Combo terbaik: ' + state.bestCombo, 480, 216);
  ctx.fillStyle = '#2E7D6B';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('Bank: ' + state.bank + ' koin — belanja upgrade:', 480, 248);
  // upgrade rows
  WR_CONFIG.upgrades.forEach(function (up, idx) {
    var y = 268 + idx * 48;
    var level = state.upgrades[up.id];
    var maxed = level >= WR_CONFIG.maxUpgradeLevel;
    var cost = maxed ? 0 : wrUpgradeCost(up.id, level);
    var afford = !maxed && state.bank >= cost;
    ctx.fillStyle = '#EFE3CC';
    wrRoundRect(ctx, 240, y, 480, 40, 10);
    ctx.fill();
    ctx.fillStyle = '#4A2E1E';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(up.name + '  Lv' + level + '/' + WR_CONFIG.maxUpgradeLevel, 254, y + 17);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#8A7A66';
    ctx.fillText(up.desc, 254, y + 33);
    var btnId = 'up_' + up.id;
    var bx = 600;
    WR_UI.buttons[btnId] = { x: bx, y: y + 5, w: 104, h: 30 };
    ctx.fillStyle = maxed ? '#8A7A66' : afford ? '#2E7D6B' : '#C9BBA6';
    wrRoundRect(ctx, bx, y + 5, 104, 30, 8);
    ctx.fill();
    ctx.fillStyle = '#FFF6E5';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(maxed ? 'MAX' : 'BELI ' + cost, bx + 52, y + 21);
    ctx.textBaseline = 'alphabetic';
  });
  wrButton(ctx, 'next', 380, 440, 200, 54, 'HARI BERIKUTNYA', '#2E7D6B');
}

function wrDrawGame(ctx, state) {
  var P = WR_CONFIG.palette;
  WR_UI.buttons = {};
  ctx.save();
  if (state.shake > 0) {
    ctx.translate(Math.random() * 6 - 3, Math.random() * 6 - 3);
  }
  // wall + floor
  ctx.fillStyle = P.wall;
  ctx.fillRect(0, 56, WR_CONFIG.canvasWidth, 250);
  ctx.fillStyle = P.floor;
  ctx.fillRect(0, 306, WR_CONFIG.canvasWidth, 294);
  // hanging sign
  ctx.fillStyle = P.terracotta;
  wrRoundRect(ctx, 330, 66, 300, 44, 10);
  ctx.fill();
  ctx.strokeStyle = '#4A2E1E';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#FFF6E5';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WARUNG RUSH', 480, 89);
  // bunting flags
  var flagColors = ['#D96C4A', '#F2B705', '#2E7D6B', '#7FB3D5'];
  for (var i = 0; i < 12; i++) {
    ctx.fillStyle = flagColors[i % flagColors.length];
    var fx = 60 + i * 75;
    ctx.beginPath();
    ctx.moveTo(fx, 120);
    ctx.lineTo(fx + 30, 120);
    ctx.lineTo(fx + 15, 140);
    ctx.closePath();
    ctx.fill();
  }
  // counter
  ctx.fillStyle = P.counter;
  ctx.fillRect(0, 400, WR_CONFIG.canvasWidth, 30);
  ctx.fillStyle = P.counterTop;
  ctx.fillRect(0, 400, WR_CONFIG.canvasWidth, 10);
  // customers + tables
  state.customers.forEach(function (c) {
    wrDrawCustomer(ctx, state, c);
  });
  // stations + tray
  WR_CONFIG.stations.forEach(function (def) {
    wrDrawStation(ctx, state, def);
  });
  wrDrawTray(ctx, state);
  // hint line
  ctx.fillStyle = '#8A7A66';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Klik stasiun buat masak • Klik nampan lalu klik pelanggan buat antar • 1-4 = masak • P = jeda • M = suara', 480, 566);
  ctx.restore();
  wrDrawHUD(ctx, state);
  if (state.screen === 'title') {
    wrDrawOverlay(ctx, state, 'WARUNG RUSH', [
      'Kamu juru masak warung! Antar pesanan sebelum',
      'pelanggan kehabisan sabar. Capai target koin',
      'sebelum waktu habis. 3 pelanggan kabur = tutup!',
      '',
      'Sate Ayam kebuka Hari 2. Combo bikin tip gede.',
      'Pelanggan VIP (mahkota emas) mbayar 2x lipat.',
      'Antar hari iso beli upgrade pakai koin bank.',
      state.best > 0 ? 'Skor terbaik: ' + state.best : 'Belum ada skor — ayo mulai!'
    ], 'start', 'MULAI', '#2E7D6B');
  } else if (state.screen === 'dayclear') {
    wrDrawDayClear(ctx, state);
  } else if (state.screen === 'gameover') {
    wrDrawOverlay(ctx, state, 'Warung Tutup!', [
      state.hearts <= 0 ? 'Kebanyakan pelanggan kabur.' : 'Target koin tidak tercapai.',
      'Skor akhir: ' + state.score + ' koin • Hari: ' + state.day,
      'Pesanan diantar: ' + state.servedToday,
      '',
      state.best > 0 ? 'Skor terbaik: ' + state.best : ''
    ], 'retry', 'MAIN LAGI', '#D96C4A');
  } else if (state.paused) {
    wrDrawOverlay(ctx, state, 'Jeda', [
      'Tekan P atau klik Lanjut buat main lagi.'
    ], 'resume', 'LANJUT', '#2E7D6B');
  }
}

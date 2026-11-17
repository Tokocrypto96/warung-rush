'use strict';
/* Warung Rush — static tuning: menu, stations, days, palette. */

var WR_CONFIG = {
  canvasWidth: 960,
  canvasHeight: 600,
  maxHearts: 3,
  traySize: 6,
  tableCount: 4,
  palette: {
    wall: '#FFE9C2',
    floor: '#F3C98F',
    counter: '#B5651D',
    counterTop: '#E8A33D',
    teal: '#2E7D6B',
    terracotta: '#D96C4A',
    cream: '#FFF6E5',
    ink: '#4A2E1E',
    gold: '#F2B705',
    red: '#D64545',
    green: '#5FA860',
    sky: '#7FB3D5'
  },
  menu: [
    { id: 'nasi', name: 'Nasi Goreng', short: 'Nasi', price: 12, cookTime: 3.5, color: '#E8A33D', station: 'wajan', unlockDay: 1 },
    { id: 'mie', name: 'Mie Goreng', short: 'Mie', price: 10, cookTime: 3.0, color: '#E07B39', station: 'panci', unlockDay: 1 },
    { id: 'esteh', name: 'Es Teh', short: 'Es Teh', price: 6, cookTime: 1.5, color: '#7FB069', station: 'kulkas', unlockDay: 1 },
    { id: 'sate', name: 'Sate Ayam', short: 'Sate', price: 15, cookTime: 5.0, color: '#B5542D', station: 'panggang', unlockDay: 2 }
  ],
  stations: [
    { id: 'wajan', name: 'Wajan', dishId: 'nasi', x: 60, y: 430, w: 150, h: 110 },
    { id: 'panci', name: 'Panci Mie', dishId: 'mie', x: 240, y: 430, w: 150, h: 110 },
    { id: 'panggang', name: 'Panggang', dishId: 'sate', x: 420, y: 430, w: 150, h: 110 },
    { id: 'kulkas', name: 'Kulkas Es', dishId: 'esteh', x: 600, y: 430, w: 150, h: 110 }
  ],
  tray: { x: 780, y: 430, w: 150, h: 110 },
  tables: [
    { x: 110, y: 170 },
    { x: 330, y: 170 },
    { x: 550, y: 170 },
    { x: 770, y: 170 }
  ],
  days: [
    { target: 60, duration: 90, spawnEvery: 7.0, patience: 30 },
    { target: 120, duration: 100, spawnEvery: 5.5, patience: 26 },
    { target: 190, duration: 110, spawnEvery: 4.5, patience: 22 }
  ],
  // Upgrades sold between days, paid from the bank (all coins ever earned).
  // Each can be bought twice; the next level costs baseCost * (level + 1).
  upgrades: [
    { id: 'fastCook', name: 'Kompor Cepat', desc: 'Masak 20% lebih cepat', baseCost: 40 },
    { id: 'bigTray', name: 'Nampan Besar', desc: '+2 slot nampan', baseCost: 35 },
    { id: 'extraHeart', name: 'Hati Ekstra', desc: '+1 hati tiap hari', baseCost: 50 }
  ],
  maxUpgradeLevel: 2,
  vipChance: 0.15, // from day 2: a VIP pays double but waits less
  vipPatience: 0.7,
  vipPay: 2
};

function wrDayConfig(day) {
  var base = WR_CONFIG.days[Math.min(day, WR_CONFIG.days.length) - 1];
  var extra = Math.max(0, day - WR_CONFIG.days.length);
  return {
    target: base.target + extra * 80,
    duration: base.duration + extra * 5,
    spawnEvery: Math.max(3.2, base.spawnEvery - extra * 0.4),
    patience: Math.max(16, base.patience - extra * 2)
  };
}

function wrDish(id) {
  return WR_CONFIG.menu.find(function (m) { return m.id === id; });
}

function wrDishUnlocked(dish, day) {
  return day >= dish.unlockDay;
}

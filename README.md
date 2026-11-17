# Warung Rush

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/Tokocrypto96/warung-rush/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/Tokocrypto96/warung-rush/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

Kamu juru masak warung! Pelanggan datang, pesan makanan, dan kamu harus
masak lalu antar sebelum mereka kehabisan sabar. Capai target koin sebelum
waktu habis — kalau 3 pelanggan kabur, warung tutup.

Entry for [make.fun **best-game-01**](https://make.fun/bounty/best-game-01) ("Make the best game", $1,000 in USDC).

## Cara main

- **Klik stasiun** (Wajan, Panci Mie, Panggang, Kulkas Es) atau tekan **1–4**
  untuk mulai masak. Tiap masakan butuh waktu — tunggu sampai matang.
- Masakan matang masuk ke **Nampan**. **Klik masakan di nampan**, lalu
  **klik pelanggan** yang pesannya cocok untuk mengantar.
- Antar cepat = tip besar. Combo beruntun bikin tip makin gede (sampai 2x).
- Sabar pelanggan habis = mereka kabur dan kamu kehilangan 1 hati.
  3 hati hilang = game over.
- Capai target koin sebelum timer habis untuk lanjut ke hari berikutnya.
  Tiap hari lebih rame: pelanggan datang lebih cepat, sabar lebih pendek.
  **Sate Ayam** kebuka mulai Hari 2.
- **Pelanggan VIP** (mahkota emas, mulai Hari 2) mbayar 2x lipat tapi
  sabar luwih cekak.
- Koin sing dikumpul masuk **Bank**. Antar hari, belanja **upgrade**
  pakai koin bank: Kompor Cepat (masak 20% luwih cepet), Nampan Besar
  (+2 slot), Hati Ekstra (+1 hati). Saben iso dituku 2x, rego mundak
  tiap level. Klik tombol BELI opo tekan 1–3 nang layar antar hari.
- **P** = jeda, **M** = suara nyala/mati, **Enter** = mulai / lanjut.

## Jalanin lokal

Buka `game/index.html` lewat static server apa saja, contoh:

```sh
cd game && python3 -m http.server 8080
```

Terus buka http://localhost:8080/ di desktop Chrome. Game 100% offline —
tanpa network request, tanpa library luar, semua art + suara dibuat
langsung dari kode (canvas + WebAudio).

## Struktur

- `game/index.html` — halaman game
- `game/src/config.js` — menu, stasiun, tuning hari, palet
- `game/src/state.js` — state game (hari, koin, hati, combo)
- `game/src/customers.js` — pelanggan: datang, pesan, sabar, pergi
- `game/src/kitchen.js` — stasiun masak, nampan, antar pesanan
- `game/src/render.js` — semua gambar (canvas)
- `game/src/audio.js` — efek suara (WebAudio, tanpa file audio)
- `game/src/input.js` — mouse + keyboard
- `game/src/main.js` — bootstrap + main loop
- `main.ts` — entrypoint: menyalin `game/` + `screenshots/` ke `/output`
  dan menulis `dossier.json` (Node 22, standard library only)
- `vendor/makefun-game.ts` — library dossier dari kit make.fun (tidak diubah)

## Lisensi

MIT — lihat `LICENSE`.

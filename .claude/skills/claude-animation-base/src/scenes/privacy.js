// privacy.js: "My data is mine", 15 s. A little girl guards her personal-data card from a phishing hook and locks it in a safe.
(() => {
  const G = 880;
  const WIPE = [PAL.indigo, PAL.teal];
  const STEEL = '#AEB6C8', STEELD = '#7D879C', GOLD = '#FFD96A';
  const SAFE = { x: 1400, y: 540, w: 320, h: 340 };
  const LATCH = [SAFE.x + SAFE.w - 62, SAFE.y + 215];
  const HS = 1.7, CS = 1.3, HOLE = 76 * CS, HB = 104 * HS;
  const rot2 = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

  // mood of the room: 0 = cosy day, 1 = dusky threat
  const threat = t => kf(t, [[0, 0], [1.2, 0], [2.5, .7], [4.8, .85], [6.5, .45], [9, .12], [10.4, .12], [11.9, .5], [12.8, .45], [13.6, 0], [15, 0]]);

  function room(t) {
    const k = threat(t);
    boilSeed('wall');
    paint(rectPts(-1200, -900, W + 2400, G + 900), { wash: mixCol(mixCol(PAL.cream, PAL.sky, .45), PAL.indigo, k * .85), ink: null });
    boilSeed('window');
    paint(rrPts(150, 150, 300, 330, 18, 2), { wash: mixCol(PAL.sky, PAL.night, k * .9), ink: PAL.ink, sw: 1.3 });
    paint(ellPts(300, 300, 46, 46, 20, 1), { wash: mixCol(PAL.cream, PAL.violet, k), ink: null });
    inkLine([[300, 150], [300, 480]], 1.1); inkLine([[150, 315], [450, 315]], 1.1);
    glow(300, 300, 330, '#FFE2A0', .45 * (1 - k));
    boilSeed('frames');
    paint(rrPts(760, 150, 190, 140, 8, 1.5), { wash: mixCol(PAL.cream, PAL.indigo, k * .6), ink: PAL.ink, sw: 1.1 });
    paint(ellPts(840, 225, 28, 28, 16, 1), { wash: mixCol(PAL.rose, PAL.violet, k * .5), ink: null });
    paint([[870, 270], [905, 195], [940, 270]], { wash: mixCol(PAL.sap, PAL.night, k * .5), ink: null });
    boilSeed('floor');
    paint(rectPts(-1200, G - 10, W + 2400, 600, 2), { wash: mixCol('#E8BF8C', PAL.night, k * .7), fill: mixCol('#E8BF8C', PAL.night, k * .5), fillOp: 90, bleed: .05, tex: .6, ink: null });
    inkLine([[-200, G - 8], [W / 2, G - 14], [W + 200, G - 6]], 1.1, PAL.ink, 'ink', .5);
    boilSeed('rug');
    paint(ellPts(900, G + 85, 720, 55, 30, 3), { wash: mixCol(PAL.rose, PAL.night, k * .5), washOp: 190, ink: null });
  }

  // the personal-data card: a portrait, lines and a chip, with a punched hole at the top (hole at local 0,-76)
  function card(cx, cy, rot, o = {}) {
    const s = (o.s ?? 1) * CS;
    push(); translate(cx, cy); rotate(rot); scale(s);
    if (o.glow) glow(0, 0, 190, GOLD, o.glow);
    paint(rrPts(-70, -95, 140, 190, 14, 1.2), { wash: PAL.cream, ink: PAL.ink, sw: 1.1 });
    paint(rrPts(-66, -91, 132, 38, 10, 1), { wash: PAL.teal, ink: null });
    paint(ellPts(0, -76, 10, 10, 12, .5), { wash: mixCol(PAL.teal, PAL.night, .6), ink: PAL.ink, sw: .7 });
    paint(rrPts(-58, -45, 60, 75, 8, .8), { wash: PAL.sky, ink: PAL.ink, sw: .8 });
    paint(ellPts(-28, -20, 12, 12, 12, .5), { wash: PAL.clay, ink: null });
    paint(ellPts(-28, 16, 19, 10, 12, .5), { wash: PAL.clay, ink: null });
    const lc = mixCol(PAL.ink, PAL.cream, .45);
    for (const y of [-35, -18, -1]) inkLine([[10, y], [58, y]], .9, lc, 'inkfine', .2);
    inkLine([[-58, 52], [58, 52]], .9, lc, 'inkfine', .2); inkLine([[-58, 70], [20, 70]], .9, lc, 'inkfine', .2);
    paint(heartPts(40, 64, 13), { wash: PAL.rose, ink: null });
    pop();
  }

  // the phishing hook: eye at (x, y), swings about it; the line runs up out of frame. Curve bottom at local (36, 104).
  // coin: 0 = none, 1 = shiny bait on the tip.
  const hookB = (x, y, r) => { const [a, b] = rot2(36 * HS, 104 * HS, r); return [x + a, y + b]; };
  const hookTip = (x, y, r) => { const [a, b] = rot2(58 * HS, 40 * HS, r); return [x + a, y + b]; };
  function hook(x, y, r, coin, t) {
    boilSeed('hook');
    inkLine([[x, y - 1400], [x, y]], 1.1, STEELD, 'inkfine', 0);
    push(); translate(x, y); rotate(r); scale(HS);
    paint(ribbon(through([[0, 0], [0, 48], [3, 82], [20, 103], [46, 102], [64, 82], [62, 56]], 6), 9, 6), { wash: STEEL, ink: PAL.ink, sw: .9 });
    paint([[62, 56], [47, 58], [60, 76]], { wash: STEELD, ink: PAL.ink, sw: .7 });
    paint(ellPts(0, -4, 9, 9, 14, .5), { wash: STEEL, ink: PAL.ink, sw: .9 });
    pop();
    if (coin) {
      const [cx, cy] = hookTip(x, y, r);
      glow(cx, cy - 20, 130, GOLD, .9);
      coinAt(cx, cy - 20, 34, t);
    }
  }
  function coinAt(x, y, r, t) {
    boilSeed('coin' + Math.round(x / 8));
    paint(ellPts(x, y, r, r, 18, .8), { wash: PAL.ochre, ink: PAL.ink, sw: .9 });
    paint(ellPts(x, y, r * .62, r * .62, 14, .6), { wash: GOLD, ink: null });
    paint(starPts(x, y, r * .4, .45, 5), { wash: PAL.cream, ink: null });
    const tw = .5 + .5 * Math.sin(t * 9);
    paint(starPts(x + r * .9, y - r * .9, 9 + 7 * tw, .2, 4), { wash: PAL.cream, washOp: 150 + 100 * tw, ink: null });
  }
  const sparkle = (x, y, r, k) => { if (k > 0 && k < 1) paint(starPts(x, y, r * backOut(k) * (1 - k * .6), .25, 4, k * 2), { wash: PAL.cream, washOp: 255 * (1 - k * k), ink: null }); };
  function burst(x, y, t0, t, R = 90) {
    const a = t - t0; if (a < 0 || a > .6) return;
    glow(x, y, 60 + 150 * (1 - Math.exp(-a * 8)), '#FFE9A8', .8 * Math.exp(-a * 4));
    for (let i = 0; i < 7; i++) { const q = seg(a, i * .02, .5 + i * .02), ang = i / 7 * TAU; sparkle(x + Math.cos(ang) * R * q, y + Math.sin(ang) * R * q, 20, q); }
  }

  function safe(open, dial, glowIn = 0) {
    const { x, y, w, h } = SAFE;
    boilSeed('safe');
    paint(rectPts(x + 28, y + h - 6, 46, 30, 1), { wash: STEELD, ink: PAL.ink, sw: .9 });
    paint(rectPts(x + w - 74, y + h - 6, 46, 30, 1), { wash: STEELD, ink: PAL.ink, sw: .9 });
    paint(rrPts(x, y, w, h, 22, 1.5), { wash: mixCol(PAL.teal, PAL.indigo, .5), ink: PAL.ink, sw: 1.4 });
    paint(rrPts(x + 22, y + 22, w - 44, h - 44, 12, 1), { wash: mixCol(PAL.night, PAL.violet, .2), ink: PAL.ink, sw: 1 });
    if (glowIn) glow(x + w / 2, y + h / 2, 170, GOLD, glowIn);
    return { drawCard: (cx, cy, rot, o) => card(cx, cy, rot, o) };
  }
  function safeDoor(open, dialA) {
    const { x, y, w, h } = SAFE, dw = lerp(w - 44, 46, open), dx = x + 22, col = mixCol(PAL.teal, PAL.cream, .18);
    boilSeed('door');
    paint(rrPts(dx, y + 22, dw, h - 44, 12, 1), { wash: col, ink: PAL.ink, sw: 1.2 });
    for (const yy of [y + 42, y + h - 42]) paint(ellPts(dx + 14, yy, 4, 4, 8), { wash: STEELD, ink: null });
    const k = clamp((dw - 46) / 230);
    if (k > .05) {
      const cx = dx + dw * .55, cy = y + h * .4;
      paint(ellPts(cx, cy, 46 * k, 46, 24, .8), { wash: PAL.ochre, ink: PAL.ink, sw: 1.1 });
      paint(ellPts(cx, cy, 30 * k, 30, 20, .6), { wash: mixCol(PAL.ochre, PAL.cream, .4), ink: PAL.ink, sw: .7 });
      for (let i = 0; i < 8; i++) { const a = dialA + i * TAU / 8; inkLine([[cx + Math.cos(a) * 14 * k, cy + Math.sin(a) * 14], [cx + Math.cos(a) * 28 * k, cy + Math.sin(a) * 28]], 1, PAL.ink, 'ink', 0); }
      inkLine([[cx - 8 * k, cy], [cx + 8 * k, cy]], 2, PAL.ink, 'ink', 0);
    }
    return [dx + dw * .55, y + h * .4];
  }
  function hasp() {
    boilSeed('hasp');
    paint(rrPts(LATCH[0] - 22, LATCH[1] - 26, 44, 20, 5, .6), { wash: STEELD, ink: PAL.ink, sw: .9 });
  }
  // padlock hangs from the hasp; (x, y) = centre of its body; open 0..1 raises the shackle
  function padlock(x, y, open) {
    boilSeed('lock');
    const P = []; for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; P.push([x + Math.cos(a) * 24, y - 22 + Math.sin(a) * (30 + open * 26)]); }
    paint(ribbon(P, 9, 9), { wash: STEEL, ink: PAL.ink, sw: .9 });
    paint(rrPts(x - 38, y - 24, 76, 60, 12, .8), { wash: PAL.ochre, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(x, y + 2, 7, 7, 10, .4), { wash: PAL.ink, ink: null });
    paint(rectPts(x - 3, y + 4, 6, 16, .3), { wash: PAL.ink, ink: null });
  }
  function shield(x, y, s, k) {
    if (k <= 0) return;
    const q = s * backOut(k);
    glow(x, y, 260 * q, GOLD, .9 * clamp(k));
    const P = [[-60, -70], [0, -84], [60, -70], [62, 0], [44, 46], [0, 84], [-44, 46], [-62, 0]].map(p => [x + p[0] * q, y + p[1] * q]);
    boilSeed('shield');
    paint(P, { wash: PAL.teal, curv: .35, ink: PAL.ink, sw: 1.6 });
    paint(P.map(p => [x + (p[0] - x) * .78, y + (p[1] - y) * .78]), { wash: mixCol(PAL.teal, PAL.cream, .3), curv: .35, ink: null });
    const tk = seg(k, .3, .9);
    inkLine([[x - 28 * q, y + 2 * q], [x - 8 * q, y + 26 * q], [x + 32 * q, y - 24 * q]].map((p, i, a) => i === 0 ? p : [lerp(a[i - 1][0], p[0], tk), lerp(a[i - 1][1], p[1], tk)]), 6, PAL.cream, 'ink', .3);
  }


  // ---------- the little girl ----------
  const SKIN = '#F4C9A5', HAIR = '#5B3B2E', DRESS = '#F2B64B', BOW = '#E2476E';
  // girl(x, y, u, o): (x, y) = ground point between the feet. o: dy, sq, rot, tilt (head), mouth (0..1 open, or -1 for a smile),
  // eyes ('open' | 'happy' | 'wide' | 'closed'), brow (-1 worried/angry .. 1 raised), look (-1..1), blush,
  // aL/aR arm angle (0 = out, + = up, - = down) or handL/handR = [x, y] targets in u, walk (leg phase), sway (hair swing),
  // held(u): draws a prop between the body and the hands, in px relative to the feet.
  function girl(x, y, u, o = {}) {
    const T0 = o.t ?? T, sq = o.sq || 0, dy = (o.dy || 0) * u, tilt = o.tilt || 0, sway = o.sway ?? Math.sin(T0 * 3) * .15;
    const S = (a, b) => [a * u, b * u];
    push(); translate(x + (o.dx || 0) * u, y + dy); rotate(o.rot || 0); scale(1 + sq * .6, 1 - sq);
    const key = o.key || 'g';
    // shadow
    boilSeed(key + 'sh'); paint(ellPts(0, 2, 5.5 * u, .8 * u, 20, 1), { wash: PAL.ink, washOp: 45, ink: null });
    // legs and shoes
    boilSeed(key + 'legs');
    for (const s of [-1, 1]) {
      const ph = o.walk == null ? 0 : Math.max(0, Math.sin(o.walk * Math.PI + (s > 0 ? Math.PI : 0))), lift = ph * .9 * u, fx = s * 1.15 * u + ph * .5 * u * (o.walkDir ?? 0);
      paint(rrPts(fx - .4 * u, -1.9 * u - lift * .3, .8 * u, 1.7 * u, .3 * u, .4), { wash: SKIN, ink: PAL.ink, sw: .9 });
      paint(ellPts(fx + .15 * u * (o.walkDir ?? 0), -.35 * u - lift, 1.0 * u, .55 * u, 14, .5), { wash: '#7A4A3A', ink: PAL.ink, sw: .9 });
    }
    // pigtails behind
    const hc = [0, -5.3 * u]; push(); translate(hc[0], hc[1]); rotate(tilt); translate(-hc[0], -hc[1]);
    boilSeed(key + 'tails');
    for (const s of [-1, 1]) {
      const w = sway * s;
      const P = through([S(s * 3.4, -11.2), S(s * (5.2 + w), -9.6), S(s * (5.9 + w * 1.6), -7.2), S(s * (5.1 + w * 2), -5)], 6);
      paint(ribbon(P, 1.5 * u, .5 * u), { wash: HAIR, ink: PAL.ink, sw: .9 });
    }
    paint(ellPts(0, -9.2 * u, 4.55 * u, 4.4 * u, 28, 1), { wash: HAIR, ink: PAL.ink, sw: 1 });
    pop();
    // body (dress)
    boilSeed(key + 'body');
    paint([S(-1.9, -5.5), S(1.9, -5.5), S(3.3, -1.8), S(-3.3, -1.8)], { wash: DRESS, curv: .15, ink: PAL.ink, sw: 1.1 });
    paint([S(-3.3, -2.3), S(3.3, -2.3), S(3.3, -1.8), S(-3.3, -1.8)], { wash: mixCol(DRESS, PAL.clay, .35), ink: null });
    paint(ellPts(0, -5.45 * u, 1.5 * u, .55 * u, 14, .4), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
    paint(heartPts(0, -3.7 * u, .55 * u), { wash: BOW, ink: null });
    // held prop, then arms over it
    if (o.held) o.held(u);
    const sh = s => [s * 2.0 * u, -4.9 * u];
    const hand = (s, hnd, a) => {
      const A = sh(s); if (hnd) return S(hnd[0], hnd[1]);
      return [A[0] + s * Math.cos(a) * 2.7 * u, A[1] - Math.sin(a) * 2.7 * u];
    };
    boilSeed(key + 'arms');
    for (const s of [-1, 1]) {
      const A = sh(s), Hh = hand(s, s < 0 ? o.handL : o.handR, s < 0 ? (o.aL ?? -.9) : (o.aR ?? -.9));
      const mid = [(A[0] + Hh[0]) / 2 + s * .35 * u, (A[1] + Hh[1]) / 2 + .25 * u];
      paint(ribbon(through([A, mid, Hh], 5), .95 * u, .75 * u), { wash: SKIN, ink: PAL.ink, sw: .9 });
      paint(ellPts(A[0], A[1] + .1 * u, .85 * u, .75 * u, 10, .3), { wash: DRESS, ink: PAL.ink, sw: .8 });
      paint(ellPts(Hh[0], Hh[1], .6 * u, .6 * u, 12, .3), { wash: SKIN, ink: PAL.ink, sw: .8 });
    }
    // head
    push(); translate(hc[0], hc[1]); rotate(tilt); translate(-hc[0], -hc[1]);
    boilSeed(key + 'head');
    paint(ellPts(0, -8.9 * u, 4.2 * u, 3.9 * u, 28, .8), { wash: SKIN, ink: PAL.ink, sw: 1.1 });
    paint([S(-4.25, -9.6), S(-3.8, -12.1), S(0, -13.2), S(3.8, -12.1), S(4.25, -9.6), S(3.3, -10.5), S(2.1, -9.4), S(.7, -10.5), S(-.7, -9.5), S(-2.1, -10.6), S(-3.3, -9.5)], { wash: HAIR, curv: .2, ink: PAL.ink, sw: 1 });
    for (const s of [-1, 1]) {   // bows
      const bx = s * 3.5 * u, by = -11.3 * u;
      paint([[bx, by], [bx + s * 1.5 * u, by - .95 * u], [bx + s * 1.5 * u, by + .95 * u]], { wash: BOW, ink: PAL.ink, sw: .8 });
      paint([[bx, by], [bx - s * 1.3 * u, by - .9 * u], [bx - s * 1.3 * u, by + .9 * u]], { wash: BOW, ink: PAL.ink, sw: .8 });
      paint(ellPts(bx, by, .4 * u, .4 * u, 8), { wash: mixCol(BOW, PAL.ink, .3), ink: null });
    }
    // face
    boilSeed(key + 'face');
    const lx = (o.look || 0) * .35 * u, blink = (T0 % 3.4) < .12, eyes = blink && !o.noBlink ? 'closed' : (o.eyes || 'open');
    for (const s of [-1, 1]) {
      const ex = s * 1.65 * u + lx, ey = -8.7 * u;
      if (eyes === 'closed') inkLine([[ex - .6 * u, ey], [ex, ey + .12 * u], [ex + .6 * u, ey]], 1.4, PAL.ink, 'ink', .6);
      else if (eyes === 'happy') inkLine([[ex - .65 * u, ey + .25 * u], [ex, ey - .4 * u], [ex + .65 * u, ey + .25 * u]], 1.6, PAL.ink, 'ink', .7);
      else {
        const k = eyes === 'wide' ? 1.25 : 1;
        paint(ellPts(ex, ey, .6 * u * k, .85 * u * k, 14, .3), { wash: PAL.ink, ink: null });
        paint(ellPts(ex - .2 * u, ey - .3 * u * k, .22 * u, .26 * u, 8), { wash: PAL.cream, ink: null });
      }
      const br = o.brow ?? 0;   // -1: slanted down toward the nose (cross), 1: raised
      inkLine([[ex - .7 * u, ey - 1.15 * u - br * .3 * u + (br < 0 ? -s * br * .0 : 0)], [ex + .7 * u, ey - 1.15 * u - br * .3 * u + (br < 0 ? s * br * .45 * u : 0)]].map((p, i) => i === 1 && br < 0 ? [p[0], p[1]] : p), 1.1, HAIR, 'ink', .4);
      paint(ellPts(s * 2.75 * u, -7.5 * u, .75 * u, .42 * u, 10, .3), { wash: PAL.rose, washOp: 40 + 160 * (o.blush ?? .6), ink: null });
    }
    const m = o.mouth ?? -1;
    if (m < 0) inkLine([[-.8 * u, -6.9 * u], [0, -6.35 * u], [.8 * u, -6.9 * u]], 1.5, PAL.ink, 'ink', .7);
    else if (m < .05) inkLine([[-.6 * u, -6.7 * u], [.6 * u, -6.7 * u]], 1.4, PAL.ink, 'ink', .3);
    else {
      paint(ellPts(0, -6.7 * u, (.45 + .3 * m) * u, (.12 + .62 * m) * u, 14, .3), { wash: '#8B2E3F', ink: PAL.ink, sw: 1 });
      if (m > .45) paint(ellPts(0, -6.35 * u, .35 * u, .2 * u, 8), { wash: PAL.rose, ink: null });
    }
    pop();
    pop();
  }
  // mouth opening while she speaks: a flapping syllable pattern inside each speech window, closed (smile) outside
  const SPEECH = [[.6, 2.45], [2.55, 3.85], [3.95, 5.1], [5.6, 6.95], [7.05, 8.6], [8.7, 11.0], [11.4, 13.8]];
  function talk(t) {
    for (const [a, b] of SPEECH) if (t >= a && t <= b) {
      const e = Math.min(seg(t, a, a + .08), 1 - seg(t, b - .08, b)), f = Math.floor(t * 9);
      return e * (.2 + .8 * hash(f * 3.7)) * (.6 + .4 * Math.abs(Math.sin(t * 13)));
    }
    return -1;
  }

  // ---------- subtitles (Arabic, drawn on a soft paper plate) ----------
  const LINES = [
    [.5, 2.5, 'بياناتي الخاصة ملكي…'], [2.5, 3.9, 'أحافظ عليها'], [3.9, 5.3, 'ولا أشاركها مع الآخرين!'],
    [5.5, 7.0, 'بخطوات صغيرة'], [7.0, 8.7, 'ووعي كبير،'], [8.7, 11.2, 'نتعلم أن حماية المعلومات الشخصية'], [11.2, 14.0, 'مسؤولية تبدأ من الطفولة.']
  ];
  function caption(t) {
    for (const [a, b, txt] of LINES) {
      if (t < a || t > b) continue;
      if (Math.min(seg(t, a, a + .15), 1 - seg(t, b - .12, b)) < .04) continue;
      const al = Math.min(seg(t, a, a + .15), 1 - seg(t, b - .12, b)), w = Math.max(360, txt.length * 36 + 110);
      boilSeed('cap');
      paint(rrPts(W / 2 - w / 2, 925, w, 100, 38, 1.5), { wash: PAL.cream, washOp: 235 * al, ink: PAL.ink, sw: .9 });
      letter(txt, W / 2, 976, 62, PAL.ink, { font: 'bold 62px "DejaVu Sans", "Noto Naskh Arabic", sans-serif', ink: false, alpha: al, screen: true, pop: .6 + .4 * al });
    }
  }

  // ---------- shot A: she guards her card ----------
  const GU = 30;
  function shotGuard(t, lt, dur) {
    const gx = 760, hookX0 = 1300;
    camBegin(960, 540, 1 + .03 * seg(lt, 0, 4.5));
    room(t);
    // hook with the shiny bait: lowers, then swings in close to her card, misses, and withdraws
    let hx = hookX0, hy = kf(lt, [[1.9, -280], [3.0, 270]], easeOut), r = .09 * Math.sin(lt * 2.4);
    if (lt > 3.7) { const k = seg(lt, 3.7, 5.1); hx = kf(lt, [[3.7, hookX0], [4.35, 790], [5.1, 1330]]); hy = kf(lt, [[3.7, 270], [4.35, 500], [5.1, 120]]); r = .25 * Math.sin((lt - 3.7) * 6) * (1 - k * .7); }
    // her acting: hugging the card, noticing the hook, twisting away and shaking her head "no"
    const away = ease(seg(lt, 3.75, 4.15)) * (1 - ease(seg(lt, 4.75, 5.05)));
    const nod = 1.2 * Math.abs(Math.sin(lt * 5)) * .2;
    const noShake = lt > 4.1 && lt < 4.9 ? Math.sin((lt - 4.1) * 22) * .14 * (1 - seg(lt, 4.1, 4.9)) : 0;
    const notice = ease(seg(lt, 2.2, 2.45)) * (1 - ease(seg(lt, 3.5, 3.7)));
    const hug = ease(seg(lt, 2.5, 2.9));
    const chest = [gx - 22 * away, G - 4.7 * GU];
    const bounce = -.25 * Math.abs(Math.sin(lt * Math.PI * 2)) * (1 - away);
    const o = {
      t, dy: bounce, sq: .05 * Math.abs(Math.sin(lt * Math.PI * 2)), rot: -.2 * away, tilt: noShake + (lt < 3.7 ? .05 * Math.sin(lt * 2.5) : -.08 * away),
      mouth: talk(t), eyes: lt < 2.2 ? 'happy' : away > .3 ? 'open' : 'wide', brow: lt < 2.2 ? .6 : away > .2 ? -1 : .8, blush: .6 + .3 * away,
      look: notice * .9 - away * .5, sway: .15 * Math.sin(lt * 3) - .5 * away,
      handL: [-1.35 - hug * .15 - away * 1.1, -4.1 + .2 * Math.sin(lt * 3)], handR: [1.35 + hug * .15 - away * 1.1, -4.1 + .2 * Math.sin(lt * 3 + 1)],
      held: u => card(chest[0] - gx, chest[1] - G - dyPx(bounce, u), -.05 * away, { s: .62 - .04 * hug, glow: .25 }),
      noBlink: false
    };
    girl(gx, G, GU, o);
    hook(hx, hy, r, 1, t);
    camEnd();
    caption(t);
    flushLetters();
    boilSeed('transition');
    if (lt < .5) iris(gx, G - 6 * GU, lerp(0, 1500, easeIn(lt / .5)));
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, WIPE);
  }
  const dyPx = (d, u) => d * u;

  // ---------- shot B: small steps to the safe ----------
  function shotWalk(t, lt, dur) {
    const tW0 = .4, tW1 = 2.6, tPut = 2.9, tPutEnd = 3.5, tClose = 3.6, tSlam = 4.1;
    const x0 = 420, x1 = 1150, k = ease(seg(lt, tW0, tW1)), gx = lerp(x0, x1, k), moving = lt > tW0 && lt < tW1;
    const dist = Math.abs(gx - x0), steps = dist / (2.6 * GU), phase = steps;
    const shake = lt > tSlam ? shakeXY(t, 6 * Math.exp(-(lt - tSlam) * 9)) : [0, 0];
    camBegin(kf(lt, [[0, 960], [2.6, 1020], [dur, 1060]]) + shake[0], 540 + shake[1], 1);
    room(t);
    const open = lt < tClose ? 1 : lt < tSlam ? 1 - easeIn(seg(lt, tClose, tSlam)) : 0;
    safe(open, 0, lt > tPut ? .5 * seg(lt, tPutEnd - .2, tPutEnd + .2) * (1 - seg(lt, tClose, tSlam)) : 0);
    const bob = moving ? -Math.abs(Math.sin(phase * Math.PI)) * .45 : 0;
    const reach = ease(seg(lt, tPut - .25, tPut)) * (1 - ease(seg(lt, tPutEnd, tPutEnd + .3)));
    const chest = [gx, G - 4.7 * GU + bob * GU];
    const dest = [SAFE.x + SAFE.w / 2 + 6, SAFE.y + SAFE.h / 2];
    const o = {
      t, dy: bob, rot: moving ? .035 * Math.sin(phase * Math.PI) : 0, tilt: moving ? .07 * Math.sin(phase * Math.PI) : 0,
      walk: moving ? phase : null, walkDir: 1, mouth: talk(t), eyes: 'happy', brow: .4, blush: .7, look: lt < tPut ? .6 : 0,
      sway: moving ? .35 * Math.sin(phase * Math.PI * 2) : .1 * Math.sin(lt * 3),
      handL: [-1.35 + 1.5 * reach, -4.1 - 1.2 * reach], handR: [1.35 + 1.5 * reach, -4.1 - 1.2 * reach],
      held: u => { if (lt < tPut) card(chest[0] - gx, chest[1] - G - bob * u, 0, { s: .62, glow: .2 }); }
    };
    girl(gx, G, GU, o);
    // card travels into the safe
    if (lt >= tPut && lt < tPutEnd) { const kk = ease(seg(lt, tPut, tPutEnd)), p = arcPt([gx + 20, chest[1] - 10], dest, 90, kk); card(p[0], p[1], .12 * Math.sin(kk * Math.PI), { s: lerp(.62, .78, kk), glow: .25 }); }
    else if (lt >= tPutEnd) card(dest[0], dest[1], 0, { s: .78, glow: .2 });
    const dc = safeDoor(open, lt > tSlam ? 2.2 * easeOut(seg(lt, tSlam, tSlam + .5)) : 0);
    // the big idea: a bulb over her head at "وعي كبير"
    const ba = lt - 1.6;
    if (ba > 0 && lt < 3.2) emote('bulb', gx, G - 15.5 * GU + bob * GU, 30, seg(ba, 0, .3) * (1 - seg(lt, 2.9, 3.2)), ba);
    burst(SAFE.x + SAFE.w * .62, SAFE.y + SAFE.h * .55, tSlam, lt, 120);
    const eye = toScreen(...dc);
    camEnd();
    caption(t);
    flushLetters();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, WIPE);
    if (lt > dur - .5) iris(...eye, lerp(1500, 0, easeIn(seg(lt, dur - .5, dur - .03))));
  }

  // ---------- shot C: the lock holds ----------
  function shotLock(t, lt, dur) {
    const tLock = .4, tLand = .85, tShield = 1.0, tHookIn = 1.7, tHit = 2.55;
    const hx = 1625, hitY = 560, gx = 1190;
    const zoom = 1.12 + .03 * seg(lt, 0, 4.4), shake = lt > tHit ? shakeXY(t, 8 * Math.exp(-(lt - tHit) * 10)) : [0, 0];
    camBegin(1400 + shake[0], 600 + shake[1], zoom);
    room(t);
    safe(0, 0);
    const dc = safeDoor(0, 2.2);
    hasp();
    const ly = LATCH[1] + 22;
    const py = lt < tLand ? lerp(ly - 620, ly, easeIn(seg(lt, tLock, tLand))) : ly + 9 * spring(lt, tLand, 7, 24);
    const open = 1 - easeOut(seg(lt, tLand + .05, tLand + .2));
    if (lt >= tLock) padlock(LATCH[0], py, lt < tLand + .05 ? 1 : open);
    burst(LATCH[0], ly, tLand + .15, lt, 80);
    // the hook creeps in, clangs off the lock and flees
    let hy = -400, r = 0;
    if (lt >= tHookIn) hy = lt < tHit ? kf(lt, [[tHookIn, -360], [tHit - .25, hitY - 50], [tHit, hitY]], easeOut) + (lt < tHit - .2 ? 8 * Math.sin(lt * 11) : 0) : lerp(hitY, -520, easeIn(seg(lt, tHit + .1, 3.3))) - 40 * Math.exp(-(lt - tHit) * 12);
    if (lt >= tHit) r = .6 * spring(lt, tHit, 4, 20);
    const coinP = lt < tHit ? hookTip(hx, hy, r) : null;
    if (lt >= tHookIn && lt < 3.4) {
      boilSeed('hook');
      inkLine([[hx, hy - 1400], [hx, hy]], 1.1, STEELD, 'inkfine', 0);
      push(); translate(hx, hy); rotate(r); scale(HS);
      paint(ribbon(through([[0, 0], [0, 48], [3, 82], [20, 103], [46, 102], [64, 82], [62, 56]], 6), 9, 6), { wash: STEEL, ink: PAL.ink, sw: .9 });
      paint([[62, 56], [47, 58], [60, 76]], { wash: STEELD, ink: PAL.ink, sw: .7 });
      paint(ellPts(0, -4, 9, 9, 14, .5), { wash: STEEL, ink: PAL.ink, sw: .9 });
      pop();
      if (coinP) { glow(coinP[0], coinP[1] - 20, 120, GOLD, .8); coinAt(coinP[0], coinP[1] - 20, 34, t); }
    }
    if (lt >= tHit) {
      const a = lt - tHit, p0 = hookTip(hx, hitY, 0), x = p0[0] + 120 * a, y = Math.min(G + 22, p0[1] - 20 - 380 * a + 1100 * a * a);
      if (y >= G + 21.5) paint(ellPts(x, G + 22, 36, 12, 16, .6), { wash: PAL.ochre, ink: PAL.ink, sw: .9 }); else coinAt(x, y, 34, t);
    }
    burst(hx + 30, hitY + 30, tHit, lt, 110);
    shield(SAFE.x + SAFE.w / 2, 300, 1.35, seg(lt, tShield, tShield + .5));
    // the girl: relieved at the lock, startled by the hook, then a big proud smile and hearts
    const startle = ease(seg(lt, tHit - .1, tHit + .1)) * (1 - ease(seg(lt, tHit + .5, tHit + .8)));
    const proud = ease(seg(lt, 3.5, 3.9));
    const jmp = jump(lt, 3.9, 4.4, 1.6);
    girl(gx, G, GU, {
      t, dy: -.2 * Math.abs(Math.sin(lt * Math.PI * 2)) * (1 - startle) + jmp.dy - 1.0 * startle * Math.exp(-(lt - tHit) * 2) * 0, sq: jmp.sq + .05 * Math.abs(Math.sin(lt * Math.PI * 2)),
      tilt: .06 * Math.sin(lt * 2.5) - .08 * startle, mouth: lt > tHit - .1 && lt < tHit + .6 ? .7 : talk(t), eyes: startle > .3 ? 'wide' : proud > .5 ? 'happy' : 'open',
      brow: startle > .3 ? 1 : .5, blush: .7 + .3 * proud, look: lt < 1.4 ? .8 : lt < tHit + .6 ? .9 : 0,
      aL: -.9 + 2.3 * proud * (.6 + .4 * Math.sin(lt * 12)) * (lt > 3.5 ? 1 : 0), aR: -.9 + 2.0 * proud, sway: .15 * Math.sin(lt * 3)
    });
    if (proud > .05) emote('hearts', gx + 3.5 * GU, G - 13.5 * GU, 22, proud, lt - 3.5);
    camEnd();
    caption(t);
    flushLetters();
    boilSeed('transition');
    if (lt < .6) iris(...toScreen(...dc, { cx: 1400, cy: 600, zoom: 1.12, rot: 0 }), lerp(0, 1500, easeIn(lt / .6)));
    if (lt > dur - .6) iris(...toScreen(gx, G - 6 * GU, { cx: 1400, cy: 600, zoom, rot: 0 }), lerp(1500, 0, ease(seg(lt, dur - .6, dur - .02))));
  }

  shots([[0, shotGuard], [5.2, shotWalk], [10.0, shotLock]]);
})();

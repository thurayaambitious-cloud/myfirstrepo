// privacy.js: "The bait", 15 s. Clawd's personal-data card is snatched by a phishing hook, he takes it back and locks it away.
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

  // ---------- shot A: the bait ----------
  const CARD0 = [1060, 620];
  function shotBait(t, lt, dur) {
    const hookX = 1290, tSnag = 3.55, tYank = 3.7;
    // hook path (eye position)
    let hx = hookX, hy = kf(lt, [[1.2, -260], [2.4, 300]], easeOut), r = .1 * Math.sin(lt * 2.2) * (lt < 3 ? 1 : 0);
    if (lt >= 3.0) { const k = ease(seg(lt, 3.0, tSnag)); hx = lerp(hookX, CARD0[0] - 36, k); hy = lerp(300, CARD0[1] - HOLE - HB, k) - 70 * Math.sin(k * Math.PI); r = .1 * Math.sin(3 * 2.2) * (1 - k); }
    if (lt >= tYank) hy = lerp(CARD0[1] - HOLE - HB, -520, easeIn(seg(lt, tYank, 4.6)));
    r += ring(lt, [tYank], 5, 20) * .16;
    const bob = lt < tSnag ? 12 * Math.sin(lt * 3) : 0;
    camBegin(960, kf(lt, [[0, 540], [3.7, 540], [4.6, 470]]), 1 + .03 * seg(lt, 0, 3.7));
    room(t);
    // Clawd
    const u = 26, x0 = 780, walk = stroll(lt, 2.45, 3.1, x0, 900, u), x = lt < 2.45 ? x0 : walk.x;
    const mood = emotions(lt, [[0, 'love', { lookX: .75, lookY: .1 }], [1.55, 'surprised', { lookX: .9, lookY: -.7 }], [2.15, 'starstruck', { lookX: .9, lookY: -.8 }],
                               [3.78, 'surprised', { lookX: .3, lookY: -1 }], [4.3, 'scared', { lookX: .3, lookY: -1 }]]);
    let pose = {};
    if (lt >= 2.45 && lt < 3.1) pose = { view: 'q', walk: walk.walk };
    else if (lt >= 3.1 && lt < 3.9) pose = {};
    const jmp = jump(lt, 3.95, 4.45, 2.2);
    const reach = ease(seg(lt, 3.85, 4.0)) * (1 - ease(seg(lt, 4.5, 4.75)));
    const cl = { ...mood, ...pose, sq: (mood.sq || 0) + jmp.sq, dy: (mood.dy || 0) + jmp.dy + (pose.dy || 0) };
    if (reach > 0) { cl.aL = lerp(mood.aL ?? .2, 1.4, reach); cl.aR = lerp(mood.aR ?? .2, 1.4, reach); }
    // card: floats beside him, then hangs from the hook
    let cc = [CARD0[0], CARD0[1] + bob], cr = .05 * Math.sin(lt * 2.5);
    if (lt >= tSnag) { const B = hookB(hx, hy, r), sw = r * 1.3 + ring(lt, [tSnag, tYank], 4, 16) * .12; const o = rot2(0, HOLE, sw); cc = [B[0] + o[0], B[1] + o[1]]; cr = sw; }
    card(cc[0], cc[1], cr, { glow: lt < tSnag ? .3 : .15 });
    clawd(x, G, u, cl);
    hook(hx, hy, r, 1, t);
    camEnd();
    boilSeed('transition');
    if (lt < .5) iris(...toScreen(x0, G - 4 * u, { cx: 960, cy: 540, zoom: 1, rot: 0 }), lerp(0, 1500, easeIn(lt / .5)));
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, WIPE);
  }

  // ---------- shot B: the safe ----------
  function shotSafe(t, lt, dur) {
    const u = 26, tJ0 = 1.35, tJ1 = 2.0, tCatch = 1.72, tW0 = 2.7, tW1 = 3.9, tPut = 4.0, tPutEnd = 4.5, tClose = 4.6, tSlam = 4.95;
    const hx = 760, lower = kf(lt, [[0, 20], [1.3, 320]], easeOut);
    let hy = lower + 6 * Math.sin(lt * 3);
    if (lt >= tCatch - .05) hy = lerp(hy, -520, easeIn(seg(lt, tCatch + .05, 2.9)));
    const hr = .08 * Math.sin(lt * 2.4) * (1 - seg(lt, 1.2, 1.4)) + ring(lt, [tCatch], 5, 22) * .2;
    const shake = lt > tSlam ? shakeXY(t, 6 * Math.exp(-(lt - tSlam) * 9)) : [0, 0];
    camBegin(kf(lt, [[0, 960], [2.4, 960], [4.0, 1060]]) + shake[0], 540 + shake[1], 1);
    room(t);
    // Clawd
    const jmp = jump(lt, tJ0, tJ1, 5), walk = stroll(lt, tW0, tW1, 760, 1215, u);
    const x = lt < tJ0 ? 660 : lt < tW0 ? lerp(660, 760, ease(seg(lt, tJ0, tJ1))) : walk.x;
    const mood = emotions(lt, [[0, 'determined', { lookX: .6, lookY: -.9 }], [2.0, 'proud'], [4.0, 'hopeful', { lookX: .7, lookY: -.2 }], [4.95, 'happy']]);
    let pose = {};
    if (lt < tJ0 - .1) pose = { aL: -.3, aR: -.3 };
    else if (lt < tCatch + .3) { const a = lerp(.2, 1.45, ease(seg(lt, tJ0, tCatch))); pose = { aL: a, aR: a, ...jmp }; }
    else if (lt < tW0) pose = { aL: 1.45, aR: 1.45, ...jmp };
    else if (lt < tW1) pose = { view: 'side', walk: walk.walk, dy: walk.dy, aL: 1.45, aR: 1.45 };
    else if (lt < tPut) pose = { ...turn(lt, tW1, tW1 + .12, .25, 0), aL: 1.45, aR: 1.45 };
    else { const a = lerp(1.45, .5, ease(seg(lt, tPut + .1, tPutEnd + .1))); pose = { aL: a, aR: a }; }
    const cl = { ...mood, ...pose, sq: (mood.sq || 0) * (lt < 2.2 ? 1 : .5) + (pose.sq || 0), dy: (mood.dy || 0) * (lt < tW0 ? 1 : .2) + (pose.dy || 0) };
    if (lt >= 2.0 && lt < tPut) { cl.aL = pose.aL; cl.aR = pose.aR; }
    // safe and card
    const open = lt < tClose ? 1 : lt < tSlam ? 1 - easeIn(seg(lt, tClose, tSlam)) : 0;
    const head = [x, G + (cl.dy || 0) * u - 8 * u * (1 - (cl.sq || 0)) - 105];
    const dest = [SAFE.x + SAFE.w / 2 + 6, SAFE.y + SAFE.h / 2];
    safe(open, 0, lt > tPut ? .5 * seg(lt, tPutEnd - .2, tPutEnd + .2) * (1 - seg(lt, tClose, tSlam)) : 0);
    // card positions
    if (lt < tCatch) { const B = hookB(hx, hy, hr), o = rot2(0, HOLE, hr); card(B[0] + o[0], B[1] + o[1], hr, { glow: .2 }); }
    else if (lt < tPut) {
      const k = easeOut(seg(lt, tCatch, tCatch + .35)), B = hookB(hx, lower, 0), start = [B[0], B[1] + HOLE];
      const p = lt < tCatch + .35 ? arcPt(start, head, 60, k) : head;
      card(p[0], p[1] + (lt > 2.2 ? 3 * Math.sin(lt * 7) : 0), .06 * Math.sin(lt * 5) * seg(lt, tCatch + .3, 2.4), { s: lerp(1, .85, k), glow: .25 });
    } else if (lt < tPutEnd) {
      const k = ease(seg(lt, tPut, tPutEnd)), p = arcPt(head, dest, 90, k);
      card(p[0], p[1], .12 * Math.sin(k * Math.PI), { s: lerp(.85, .78, k), glow: .25 });
    } else card(dest[0], dest[1], 0, { s: .78, glow: .2 });
    const dc = safeDoor(open, lt > tSlam ? 2.2 * easeOut(seg(lt, tSlam, tSlam + .5)) : 0);
    clawd(x, G, u, cl);
    hook(hx, hy, hr, lt < tCatch + .05 ? 1 : 1, t);
    burst(SAFE.x + SAFE.w * .62, SAFE.y + SAFE.h * .55, tSlam, lt, 120);
    const eye = toScreen(...dc);
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, WIPE);
    if (lt > dur - .5) iris(...eye, lerp(1500, 0, easeIn(seg(lt, dur - .5, dur - .03))));
  }

  // ---------- shot C: the lock ----------
  function shotLock(t, lt, dur) {
    const u = 26, tLock = .7, tLand = 1.15, tHookIn = 1.55, tHit = 2.45, tShield = 3.15;
    const hx = 1625, hitY = 560;
    const zoom = 1.12 + .03 * seg(lt, 0, 4.2), shake = lt > tHit ? shakeXY(t, 8 * Math.exp(-(lt - tHit) * 10)) : [0, 0];
    camBegin(1400 + shake[0], 600 + shake[1], zoom);
    room(t);
    safe(0, 0);
    const dc = safeDoor(0, 2.2);
    hasp();
    // padlock drops onto the hasp
    const ly = LATCH[1] + 22;
    const py = lt < tLand ? lerp(ly - 620, ly, easeIn(seg(lt, tLock, tLand))) : ly + 9 * spring(lt, tLand, 7, 24);
    const open = 1 - easeOut(seg(lt, tLand + .05, tLand + .2));
    if (lt >= tLock) padlock(LATCH[0], py, lt < tLand + .05 ? 1 : open);
    burst(LATCH[0], ly, tLand + .15, lt, 80);
    // the hook sneaks in, clangs off the lock and flees
    let hy = -400, r = 0;
    if (lt >= tHookIn) hy = lt < tHit ? kf(lt, [[tHookIn, -360], [tHit - .25, hitY - 50], [tHit, hitY]], easeOut) + (lt < tHit - .2 ? 8 * Math.sin(lt * 11) : 0) : lerp(hitY, -520, easeIn(seg(lt, tHit + .1, 3.2))) - 40 * Math.exp(-(lt - tHit) * 12);
    if (lt >= tHit) r = .6 * spring(lt, tHit, 4, 20) * 1.0;
    const coinP = lt < tHit ? hookTip(hx, hy, r) : null;
    if (lt >= tHookIn && lt < 3.3) {
      boilSeed('hook');
      inkLine([[hx, hy - 1400], [hx, hy]], 1.1, STEELD, 'inkfine', 0);
      push(); translate(hx, hy); rotate(r); scale(HS);
      paint(ribbon(through([[0, 0], [0, 48], [3, 82], [20, 103], [46, 102], [64, 82], [62, 56]], 6), 9, 6), { wash: STEEL, ink: PAL.ink, sw: .9 });
      paint([[62, 56], [47, 58], [60, 76]], { wash: STEELD, ink: PAL.ink, sw: .7 });
      paint(ellPts(0, -4, 9, 9, 14, .5), { wash: STEEL, ink: PAL.ink, sw: .9 });
      pop();
      if (coinP) { glow(coinP[0], coinP[1] - 20, 120, GOLD, .8); coinAt(coinP[0], coinP[1] - 20, 34, t); }
    }
    if (lt >= tHit) {   // the coin pops off and falls to the floor, bounces, lies flat
      const a = lt - tHit, p0 = hookTip(hx, hitY, 0), x = p0[0] + 120 * a, y = Math.min(G + 22, p0[1] - 20 - 380 * a + 1100 * a * a);
      const landed = y >= G + 22 - .5;
      if (landed) paint(ellPts(x, G + 22, 36, 12, 16, .6), { wash: PAL.ochre, ink: PAL.ink, sw: .9 }); else coinAt(x, y, 34, t);
    }
    burst(hx + 30, hitY + 30, tHit, lt, 110);
    // shield
    shield(SAFE.x + SAFE.w / 2, 300, 1.35, seg(lt, tShield, tShield + .5));
    // Clawd watches
    const mood = emotions(lt, [[0, 'proud', { lookX: .8 }], [1.35, 'relieved', { lookX: .7, lookY: -.3 }], [1.9, 'suspicious', { lookX: .9, lookY: -.8 }],
                               [3.0, 'cool'], [3.6, 'love', { lookX: .8, lookY: -.2 }]]);
    clawd(1190, G, u, { ...mood, view: 'front' });
    camEnd();
    boilSeed('transition');
    if (lt < .6) iris(...toScreen(...dc, { cx: 1400, cy: 600, zoom: 1.12, rot: 0 }), lerp(0, 1500, easeIn(lt / .6)));
    if (lt > dur - .6) iris(...toScreen(1190, G - 4 * u, { cx: 1400, cy: 600, zoom, rot: 0 }), lerp(1500, 0, ease(seg(lt, dur - .6, dur - .02))));
  }

  shots([[0, shotBait], [4.8, shotSafe], [10.4, shotLock]]);
})();

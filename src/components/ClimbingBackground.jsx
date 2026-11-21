"use client";

import { useEffect, useRef } from "react";

const STEP = 36;
const SPREAD = 34;
const ARM = [33, 31];
const LEG = [40, 40];
const TORSO = 56;
const HEAD = 11;
const MOVE_ORDER = ["rh", "lh", "rf", "lf"];
const LIMBS = {
  lh: { side: -1, hand: true },
  rh: { side: 1, hand: true },
  lf: { side: -1, hand: false },
  rf: { side: 1, hand: false },
};

const CLIMBERS = [
  {
    seed: 0,
    wall: "right",
    outfit: {
      skin: "#f2c4a0",
      hair: "#4a2f1f",
      shirt: "#14b8a6",
      sleeves: true,
      pants: "#334155",
      shoes: "#f97316",
      chalkBag: "#a855f7",
    },
    ponytail: false,
    tempo: 1,
    pauseOffset: 0,
  },
  {
    seed: 57,
    wall: "left",
    outfit: {
      skin: "#e9b896",
      hair: "#b4532a",
      shirt: "#f43f5e",
      sleeves: false,
      pants: "#1e293b",
      shoes: "#22c55e",
      chalkBag: "#facc15",
      hairTie: "#facc15",
    },
    ponytail: true,
    tempo: 1.12,
    pauseOffset: 0.9,
  },
];

const rand = (a, b = 0) => {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

const routeHold = (i, seed) => ({
  x: (i % 2 === 0 ? -SPREAD : SPREAD) + (rand(i, 1 + seed) - 0.5) * 18,
  y: -i * STEP + (rand(i, 2 + seed) - 0.5) * 10,
});

// Two-bone IK. The bend side is fixed relative to the limb direction so elbows and knees never flip.
const solveIK = (root, target, [l1, l2], bend) => {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const raw = Math.hypot(dx, dy) || 0.001;
  const d = Math.min(Math.max(raw, Math.abs(l1 - l2) + 0.5), l1 + l2 - 0.5);
  const theta = Math.atan2(dy, dx);
  const alpha = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const px = (-dy / raw) * bend;
  const py = (dx / raw) * bend;
  const [a, b] = [theta + alpha, theta - alpha].map((angle) => ({
    x: root.x + l1 * Math.cos(angle),
    y: root.y + l1 * Math.sin(angle),
  }));
  const joint = (a.x - root.x) * px + (a.y - root.y) * py >= 0 ? a : b;
  const ja = Math.atan2(target.y - joint.y, target.x - joint.x);
  return { joint, end: { x: joint.x + l2 * Math.cos(ja), y: joint.y + l2 * Math.sin(ja) } };
};

const limbRoot = (key, shoulders, hips) =>
  LIMBS[key].hand
    ? { x: shoulders.x + LIMBS[key].side * 10, y: shoulders.y + 2 }
    : { x: hips.x + LIMBS[key].side * 6, y: hips.y };

const bodyAxis = (shoulders, hips) => {
  const x = shoulders.x - hips.x;
  const y = shoulders.y - hips.y;
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
};

const headCenter = (shoulders, hips) => {
  const up = bodyAxis(shoulders, hips);
  return { x: shoulders.x + up.x * (HEAD + 8), y: shoulders.y + up.y * (HEAD + 8) };
};

const bodyTarget = (targets, exclude) => {
  const hands = lerp(targets.lh, targets.rh, 0.5);
  const feet = lerp(targets.lf, targets.rf, 0.5);
  const shoulderY = hands.y + Math.max(10, (feet.y - hands.y - TORSO) * 0.45);
  const shoulders = { x: hands.x * 0.6 + feet.x * 0.4, y: shoulderY };
  const hips = { x: feet.x * 0.6 + hands.x * 0.4, y: shoulderY + TORSO };
  for (let iter = 0; iter < 14; iter++) {
    for (const key of Object.keys(LIMBS)) {
      if (key === exclude) continue;
      const part = LIMBS[key].hand ? shoulders : hips;
      const lengths = LIMBS[key].hand ? ARM : LEG;
      const root = limbRoot(key, shoulders, hips);
      const vx = targets[key].x - root.x;
      const vy = targets[key].y - root.y;
      const dist = Math.hypot(vx, vy);
      const max = (lengths[0] + lengths[1]) * 0.9;
      if (dist > max) {
        part.x += (vx * (dist - max)) / dist;
        part.y += (vy * (dist - max)) / dist;
      }
    }
    const tx = hips.x - shoulders.x;
    const ty = hips.y - shoulders.y;
    const len = Math.hypot(tx, ty) || 1;
    const fix = (len - TORSO) / 2 / len;
    shoulders.x += tx * fix;
    shoulders.y += ty * fix;
    hips.x -= tx * fix;
    hips.y -= ty * fix;
  }
  return { shoulders, hips };
};

const buildClimber = ({ shoulders, hips, ends, harnessColor, outfit, ponytail }) => {
  const shapes = [];
  const seg = (a, b, w, color) => shapes.push({ type: "seg", a, b, w, color });
  const dot = (c, r, color) => shapes.push({ type: "dot", c, r, color });

  const up = bodyAxis(shoulders, hips);
  const across = { x: -up.y, y: up.x };
  const waist = lerp(hips, shoulders, 0.3);

  for (const key of ["lf", "rf"]) {
    const { side } = LIMBS[key];
    const root = limbRoot(key, shoulders, hips);
    const { joint, end } = solveIK(root, ends[key], LEG, -side);
    seg(root, joint, 12, outfit.pants);
    seg(joint, end, 10, outfit.pants);
    const shin = { x: end.x - joint.x, y: end.y - joint.y };
    const shinLen = Math.hypot(shin.x, shin.y) || 1;
    const toe = { x: end.x + side * 7 + (shin.x / shinLen) * 2, y: end.y + (shin.y / shinLen) * 2 };
    seg(end, toe, 8, outfit.shoes);
  }

  seg(hips, waist, 18, outfit.pants);
  const neck = { x: shoulders.x + up.x * 9, y: shoulders.y + up.y * 9 };
  seg(shoulders, neck, 7, outfit.skin);
  seg(
    { x: waist.x + across.x * 8, y: waist.y + across.y * 8 },
    { x: waist.x - across.x * 8, y: waist.y - across.y * 8 },
    5,
    harnessColor
  );
  seg(waist, shoulders, outfit.sleeves ? 21 : 19, outfit.shirt);
  seg(
    { x: shoulders.x - 10, y: shoulders.y + 2 },
    { x: shoulders.x + 10, y: shoulders.y + 2 },
    outfit.sleeves ? 13 : 10,
    outfit.shirt
  );
  dot({ x: hips.x - up.x * 2, y: hips.y - up.y * 2 }, 5, outfit.chalkBag);

  for (const key of ["lh", "rh"]) {
    const { side } = LIMBS[key];
    const root = limbRoot(key, shoulders, hips);
    const { joint, end } = solveIK(root, ends[key], ARM, side);
    seg(root, joint, outfit.sleeves ? 8 : 7, outfit.skin);
    seg(joint, end, outfit.sleeves ? 7 : 6, outfit.skin);
    if (outfit.sleeves) seg(root, lerp(root, joint, 0.4), 11, outfit.shirt);
    dot(end, 4.5, outfit.skin);
  }

  const head = headCenter(shoulders, hips);
  dot(head, HEAD, outfit.hair);
  if (ponytail) {
    seg(ponytail[0], ponytail[1], 10, outfit.hair);
    seg(ponytail[1], ponytail[2], 8, outfit.hair);
    seg(ponytail[2], ponytail[3], 5, outfit.hair);
    dot(ponytail[0], 3.5, outfit.hairTie);
  }
  return shapes;
};

const paintShapes = (ctx, shapes, { offset = 0, grow = 0, color = null }) => {
  for (const s of shapes) {
    ctx.strokeStyle = ctx.fillStyle = color || s.color;
    if (s.type === "seg") {
      ctx.lineWidth = s.w + grow;
      ctx.beginPath();
      ctx.moveTo(s.a.x + offset, s.a.y + offset);
      ctx.lineTo(s.b.x + offset, s.b.y + offset);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(s.c.x + offset, s.c.y + offset, s.r + grow / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const CROUCH = 0.35;
const FLIGHT = 0.42;
const SWING = 1.1;
const PONYTAIL_SEGMENTS = [12, 12, 10];
const DRAW_EVERY = 6;
const GRAVITY = 1500;

const drawPos = (i) => ({ x: 4, y: -i * STEP - STEP / 2 });
// Highest quickdraw below the harness: the one the rope runs through.
const clipIndexFor = (hipsY) => Math.floor((-hipsY - STEP / 2) / STEP / DRAW_EVERY) * DRAW_EVERY;

const createClimber = (config) => {
  const { seed, tempo, pauseOffset } = config;
  const hold = (i) => routeHold(i, seed);
  const limbs = { lh: 4, rh: 5, lf: 2, rf: 3 };
  const limbPos = Object.fromEntries(Object.entries(limbs).map(([k, i]) => [k, hold(i)]));
  const holdTargets = () => Object.fromEntries(Object.entries(limbs).map(([k, i]) => [k, hold(i)]));

  const start = bodyTarget(holdTargets());
  const body = {
    shoulders: { ...start.shoulders, vx: 0, vy: 0 },
    hips: { ...start.hips, vx: 0, vy: 0 },
  };
  const particles = [];
  let camY = (body.shoulders.y + body.hips.y) / 2;
  let moveCount = 0;
  let lastDyno = -1;
  let highestClip = clipIndexFor(body.hips.y);
  let state = { type: "pause", t: 0, duration: 0.5 + pauseOffset };

  const ponytailAnchor = () => {
    const up = bodyAxis(body.shoulders, body.hips);
    const head = headCenter(body.shoulders, body.hips);
    return { x: head.x + up.x * 4, y: head.y + up.y * 4 };
  };
  const ponytail = (() => {
    if (!config.ponytail) return null;
    const anchor = ponytailAnchor();
    let y = anchor.y;
    return [anchor, ...PONYTAIL_SEGMENTS.map((len) => {
      y += len;
      return { x: anchor.x, y, px: anchor.x, py: y };
    })];
  })();

  const chalk = (pos, amount) => {
    for (let k = 0; k < amount; k++) {
      particles.push({
        x: pos.x + (Math.random() - 0.5) * 6,
        y: pos.y,
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.9) * 30,
        life: 0.8 + Math.random() * 0.4,
      });
    }
  };

  const springBody = (target, dt) => {
    const omega = 8;
    for (const part of ["shoulders", "hips"]) {
      const p = body[part];
      p.vx += (omega * omega * (target[part].x - p.x) - 2 * omega * p.vx) * dt;
      p.vy += (omega * omega * (target[part].y - p.y) - 2 * omega * p.vy) * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  };

  const setBody = (target, dt) => {
    for (const part of ["shoulders", "hips"]) {
      const p = body[part];
      p.vx = (target[part].x - p.x) / dt;
      p.vy = (target[part].y - p.y) / dt;
      p.x = target[part].x;
      p.y = target[part].y;
    }
  };

  const nextState = () => {
    if (moveCount > 0 && moveCount % 8 === 0 && lastDyno !== moveCount && rand(moveCount, 99 + seed) < 0.75) {
      lastDyno = moveCount;
      const from = Object.fromEntries(Object.keys(limbs).map((k) => [k, { ...limbPos[k] }]));
      for (const k of Object.keys(limbs)) limbs[k] += 4;
      const to = holdTargets();
      const fromBody = { shoulders: { ...body.shoulders }, hips: { ...body.hips } };
      state = { type: "dyno", t: 0, from, to, fromBody, toBody: bodyTarget(to), caught: false };
      return;
    }
    const limb = MOVE_ORDER[moveCount % MOVE_ORDER.length];
    const from = { ...limbPos[limb] };
    limbs[limb] += 2;
    state = { type: "move", t: -0.2, limb, from, to: hold(limbs[limb]) };
    moveCount += 1;
  };

  const updateMove = (dt) => {
    state.t += dt / 0.6;
    const u = clamp01(state.t);
    const { side, hand } = LIMBS[state.limb];
    const lift = Math.sin(Math.PI * u);
    const pos = lerp(state.from, state.to, ease(u));
    limbPos[state.limb] = {
      x: pos.x + side * lift * (hand ? 9 : 6),
      y: pos.y - lift * (hand ? 6 : 10),
    };
    springBody(bodyTarget(holdTargets(), state.t < 0.85 ? state.limb : null), dt);
    if (state.t >= 1) {
      limbPos[state.limb] = { ...state.to };
      if (hand) chalk(state.to, 6);
      state = { type: "pause", t: 0, duration: 0.12 + rand(moveCount, 5 + seed) * 0.25 };
    }
  };

  const updateDyno = (dt) => {
    state.t += dt;
    const { t, from, to, fromBody, toBody } = state;
    const crouchPose = (k) => ({
      shoulders: { x: fromBody.shoulders.x, y: fromBody.shoulders.y + 10 * k },
      hips: { x: fromBody.hips.x, y: fromBody.hips.y + 18 * k },
    });
    let pose;

    if (t < CROUCH) {
      pose = crouchPose(ease(t / CROUCH));
      for (const k of Object.keys(limbs)) limbPos[k] = { ...from[k] };
    } else if (t < CROUCH + FLIGHT) {
      const u = (t - CROUCH) / FLIGHT;
      const crouched = crouchPose(1);
      const lift = -24 * Math.sin((Math.PI / 2) * u);
      const k = easeOut(u);
      pose = {
        shoulders: {
          x: crouched.shoulders.x + (toBody.shoulders.x - crouched.shoulders.x) * k,
          y: crouched.shoulders.y + (toBody.shoulders.y - crouched.shoulders.y) * k + lift,
        },
        hips: {
          x: crouched.hips.x + (toBody.hips.x - crouched.hips.x) * k,
          y: crouched.hips.y + (toBody.hips.y - crouched.hips.y) * k + lift,
        },
      };
      for (const key of ["lh", "rh"]) {
        const h = clamp01((u - 0.1) / 0.85);
        limbPos[key] = lerp(from[key], to[key], ease(h));
        limbPos[key].x += LIMBS[key].side * Math.sin(Math.PI * h) * 10;
      }
      for (const key of ["lf", "rf"]) {
        const dangle = { x: pose.hips.x + LIMBS[key].side * 12, y: pose.hips.y + 62 };
        limbPos[key] = lerp(from[key], dangle, ease(clamp01(u * 2.2)));
      }
    } else {
      const v = clamp01((t - CROUCH - FLIGHT) / SWING);
      if (!state.caught) {
        state.caught = true;
        chalk(to.lh, 12);
        chalk(to.rh, 12);
      }
      const decay = Math.exp(-3.5 * v) * (1 - v);
      const swingY = -24 * Math.cos(3 * Math.PI * v) * decay;
      const swingX = 14 * Math.sin(2.5 * Math.PI * v) * decay;
      pose = {
        shoulders: { x: toBody.shoulders.x + swingX * 0.4, y: toBody.shoulders.y + swingY },
        hips: { x: toBody.hips.x + swingX, y: toBody.hips.y + swingY },
      };
      limbPos.lh = { ...to.lh };
      limbPos.rh = { ...to.rh };
      [["lf", 0.35], ["rf", 0.55]].forEach(([key, startAt]) => {
        const dangle = { x: pose.hips.x + LIMBS[key].side * 12 + swingX * 0.8, y: pose.hips.y + 62 };
        limbPos[key] = lerp(dangle, to[key], ease(clamp01((v - startAt) / 0.3)));
      });
    }

    setBody(pose, dt);
    if (t >= CROUCH + FLIGHT + SWING) {
      for (const k of Object.keys(limbs)) limbPos[k] = { ...to[k] };
      body.shoulders.vx = body.shoulders.vy = body.hips.vx = body.hips.vy = 0;
      state = { type: "pause", t: 0, duration: 0.5 };
    }
  };

  const fall = () => {
    if (state.type === "fall" || state.type === "regrab") return;
    const clip = highestClip;
    if (clip < 0) return;
    const anchor = drawPos(clip);
    chalk(limbPos.lh, 8);
    chalk(limbPos.rh, 8);
    body.hips.vx = (Math.random() - 0.5) * 160;
    body.hips.vy = -80;
    state = {
      type: "fall",
      t: 0,
      clip,
      anchor,
      ropeLength: Math.hypot(body.hips.x - anchor.x, body.hips.y - anchor.y) + 14,
    };
  };

  const updateFall = (dt) => {
    state.t += dt;
    const { anchor, ropeLength, t } = state;
    const hips = body.hips;
    let ax = 0;
    let ay = GRAVITY;
    const dx = hips.x - anchor.x;
    const dy = hips.y - anchor.y;
    const dist = Math.hypot(dx, dy) || 0.001;
    if (dist > ropeLength) {
      const nx = dx / dist;
      const ny = dy / dist;
      const stretch = dist - ropeLength;
      const radialSpeed = hips.vx * nx + hips.vy * ny;
      const pull = 220 * stretch + 9 * radialSpeed;
      ax -= nx * pull;
      ay -= ny * pull;
    }
    hips.vx = (hips.vx + ax * dt) * 0.997;
    hips.vy = (hips.vy + ay * dt) * 0.997;
    hips.x += hips.vx * dt;
    hips.y += hips.vy * dt;

    const tilt = Math.max(-0.5, Math.min(0.5, hips.vx * 0.003 + Math.atan2(anchor.x - hips.x, 400)));
    const prevShoulders = { x: body.shoulders.x, y: body.shoulders.y };
    body.shoulders.x = hips.x + Math.sin(tilt) * TORSO;
    body.shoulders.y = hips.y - Math.cos(tilt) * TORSO;
    body.shoulders.vx = (body.shoulders.x - prevShoulders.x) / dt;
    body.shoulders.vy = (body.shoulders.y - prevShoulders.y) / dt;

    const calm = clamp01((t - 0.7) / 0.8);
    for (const key of Object.keys(LIMBS)) {
      const { side, hand } = LIMBS[key];
      const wobble = Math.sin(t * (hand ? 14 : 9) + side) * (1 - calm);
      if (hand) {
        const flail = { x: body.shoulders.x + side * (22 + 8 * wobble), y: body.shoulders.y - 36 + 10 * wobble };
        const reach = { x: body.shoulders.x + side * 24, y: body.shoulders.y - 34 };
        limbPos[key] = lerp(flail, reach, calm);
      } else {
        limbPos[key] = { x: hips.x + side * (14 + 5 * wobble), y: hips.y + 64 - 8 * wobble };
      }
    }

    const speed = Math.hypot(hips.vx, hips.vy);
    if ((t > 1.8 && speed < 70) || t > 3) startRegrab();
  };

  const startRegrab = () => {
    const base = Math.round(-(body.shoulders.y - 40) / STEP);
    const lh = base - (((base % 2) + 2) % 2);
    Object.assign(limbs, { lh, rh: lh + 1, lf: lh - 2, rf: lh - 1 });
    moveCount = Math.ceil(moveCount / MOVE_ORDER.length) * MOVE_ORDER.length;
    lastDyno = moveCount;
    const from = Object.fromEntries(Object.keys(limbs).map((k) => [k, { ...limbPos[k] }]));
    state = { type: "regrab", t: 0, clip: state.clip, from, to: holdTargets() };
  };

  const updateRegrab = (dt) => {
    state.t += dt / 0.9;
    const { t, from, to } = state;
    for (const key of Object.keys(LIMBS)) {
      const startAt = LIMBS[key].hand ? 0 : 0.35;
      limbPos[key] = lerp(from[key], to[key], ease(clamp01((t - startAt) / 0.55)));
    }
    springBody(bodyTarget(to), dt);
    if (t >= 1) {
      for (const key of Object.keys(LIMBS)) limbPos[key] = { ...to[key] };
      chalk(to.lh, 6);
      chalk(to.rh, 6);
      state = { type: "pause", t: 0, duration: 0.6 };
    }
  };

  const updatePonytail = (dt) => {
    if (!ponytail) return;
    const anchor = ponytailAnchor();
    ponytail[0] = anchor;
    for (let i = 1; i < ponytail.length; i++) {
      const p = ponytail[i];
      const vx = (p.x - p.px) * 0.9;
      const vy = (p.y - p.py) * 0.9;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + 900 * dt * dt;
    }
    for (let iter = 0; iter < 3; iter++) {
      for (let i = 1; i < ponytail.length; i++) {
        const a = ponytail[i - 1];
        const b = ponytail[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const k = (dist - PONYTAIL_SEGMENTS[i - 1]) / dist;
        b.x -= dx * k;
        b.y -= dy * k;
      }
    }
  };

  const update = (rawDt, boost) => {
    const dt = rawDt * tempo * (1 + boost);
    if (state.type === "pause") {
      state.t += dt;
      springBody(bodyTarget(holdTargets()), dt);
      if (state.t >= state.duration) nextState();
    } else if (state.type === "move") {
      updateMove(dt);
    } else if (state.type === "fall") {
      updateFall(Math.min(rawDt, 1 / 30));
    } else if (state.type === "regrab") {
      updateRegrab(rawDt);
    } else {
      updateDyno(dt);
    }
    updatePonytail(Math.min(rawDt, 1 / 30));
    if (state.type !== "fall") highestClip = Math.max(highestClip, clipIndexFor(body.hips.y));

    const follow = state.type === "fall" ? 0.02 : 0.2;
    camY += ((body.shoulders.y + body.hips.y) / 2 - camY) * (1 - Math.pow(follow, rawDt));

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * rawDt;
      p.y += p.vy * rawDt;
      p.vy += 25 * rawDt;
      p.vx *= 0.97;
      p.life -= rawDt * 1.1;
      if (p.life <= 0) particles.splice(i, 1);
    }
  };

  return {
    config,
    hold,
    body,
    limbPos,
    particles,
    ponytail,
    update,
    fall,
    getCamY: () => camY,
    getClip: () => highestClip,
  };
};

const noise1 = (x, seed) => {
  const i = Math.floor(x);
  const f = x - i;
  const s = f * f * (3 - 2 * f);
  return rand(i, seed) * (1 - s) + rand(i + 1, seed) * s;
};

const fbm = (x, seed) =>
  noise1(x, seed) * 0.6 + noise1(x * 2.3, seed + 11) * 0.28 + noise1(x * 5.1, seed + 23) * 0.12;

const ROCK = 46;

const scenePalette = (dark) =>
  dark
    ? {
        skyTop: "#0b1430",
        skyBottom: "#070b18",
        mountains: ["#1d2844", "#161f37", "#10172a"],
        snow: "rgba(203,213,225,0.35)",
        rock: [222, 10, 23],
        rim: "rgba(148,163,184,0.3)",
        edge: "rgba(0,0,0,0.55)",
        grass: "#3f5a2a",
        chalk: "rgba(255,255,255,0.45)",
        cloud: "rgba(148,163,184,0.07)",
        crack: "rgba(0,0,0,0.45)",
        cliffShadow: 0.5,
      }
    : {
        skyTop: "#b9dbf6",
        skyBottom: "#f5f9fc",
        mountains: ["#d6e1ed", "#bccbdc", "#a2b5c9"],
        snow: "rgba(255,255,255,0.95)",
        rock: [28, 9, 57],
        rim: "rgba(255,255,255,0.5)",
        edge: "rgba(41,37,36,0.45)",
        grass: "#65a30d",
        chalk: "rgba(255,255,255,0.8)",
        cloud: "rgba(255,255,255,0.85)",
        crack: "rgba(41,37,36,0.35)",
        cliffShadow: 0.15,
      };

const blobPath = (ctx, x, y, r, seed) => {
  const points = 7;
  ctx.beginPath();
  for (let k = 0; k < points; k++) {
    const a = (k / points) * Math.PI * 2 + rand(seed, 40) * Math.PI;
    const rr = r * (0.7 + 0.5 * rand(seed, k + 10));
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr * 0.75;
    if (k === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
};

const drawKnob = (ctx, x, y, r, seed, pal, chalked) => {
  const [h, s, l] = pal.rock;
  ctx.fillStyle = `hsl(${h} ${s}% ${Math.max(4, l - 24)}%)`;
  blobPath(ctx, x, y + r * 0.45, r * 1.05, seed);
  ctx.fill();
  ctx.fillStyle = `hsl(${h} ${s}% ${l + 8}%)`;
  blobPath(ctx, x, y, r, seed);
  ctx.fill();
  ctx.fillStyle = `hsl(${h} ${s}% ${l + 18}%)`;
  blobPath(ctx, x - r * 0.15, y - r * 0.25, r * 0.5, seed + 1);
  ctx.fill();
  if (chalked) {
    ctx.fillStyle = pal.chalk;
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.2, r * 0.8, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  }
};

const ridge = (x, seed) => Math.pow(1 - Math.abs(2 * fbm(x, seed) - 1), 1.6);

const CHUNK = 384;
const SKY_LIGHT = { x: 0.72, y: 0.15 };

const createLayer = (w, h, dpr, originX = 0) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(w * dpr));
  canvas.height = Math.max(1, Math.ceil(h * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, -originX * dpr, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  return { canvas, ctx };
};

// Static part of the sky: gradient, sun or moon, stars and mountains. Redrawn only on resize, theme change or scroll.
const renderSky = (ctx, { width, height, pal, dark, shift }) => {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, pal.skyTop);
  sky.addColorStop(1, pal.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const lightX = width * SKY_LIGHT.x;
  const lightY = height * SKY_LIGHT.y;
  if (dark) {
    ctx.fillStyle = "#ffffff";
    for (let k = 0; k < 140; k++) {
      ctx.globalAlpha = 0.15 + 0.5 * rand(k, 504);
      ctx.beginPath();
      ctx.arc(rand(k, 501) * width, rand(k, 502) * height * 0.75, 0.5 + rand(k, 505) * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
    const glow = ctx.createRadialGradient(lightX, lightY, 10, lightX, lightY, 110);
    glow.addColorStop(0, "rgba(226,232,240,0.25)");
    glow.addColorStop(1, "rgba(226,232,240,0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = glow;
    ctx.fillRect(lightX - 110, lightY - 110, 220, 220);
    ctx.fillStyle = "#e2e8f0";
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(lightX, lightY, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.globalAlpha = 0.25;
    [[-7, -5, 5], [6, 4, 4], [-2, 9, 3]].forEach(([dx, dy, r]) => {
      ctx.beginPath();
      ctx.arc(lightX + dx, lightY + dy, r, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    const glow = ctx.createRadialGradient(lightX, lightY, 18, lightX, lightY, 110);
    glow.addColorStop(0, "rgba(255,247,225,0.35)");
    glow.addColorStop(1, "rgba(255,247,225,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(lightX - 110, lightY - 110, 220, 220);
    ctx.fillStyle = "#fffaf0";
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.arc(lightX, lightY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.globalAlpha = 1;
  pal.mountains.forEach((color, layer) => {
    const base = height * (0.6 + layer * 0.11) + shift * (0.3 + layer * 0.35);
    const amp = height * (0.3 - layer * 0.07);
    const scale = 340 - layer * 80;
    const seed = 300 + layer * 17;
    const mountain = new Path2D();
    mountain.moveTo(0, height + 5);
    for (let x = 0; x <= width + 10; x += 10) {
      mountain.lineTo(x, base - amp * ridge(x / scale, seed));
    }
    mountain.lineTo(width + 10, height + 5);
    mountain.closePath();
    ctx.fillStyle = color;
    ctx.fill(mountain);

    if (layer < 2) {
      ctx.save();
      ctx.clip(mountain);
      ctx.fillStyle = pal.snow;
      ctx.beginPath();
      ctx.moveTo(0, -5);
      for (let x = 0; x <= width + 10; x += 10) {
        ctx.lineTo(x, base - amp * 0.72 + (noise1(x / 25, seed + 5) - 0.5) * 16);
      }
      ctx.lineTo(width + 10, -5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  });
};

// Animated part of the sky: twinkling stars, clouds and birds.
const drawSkyLife = (ctx, { width, height, pal, dark, time, clouds, birds }) => {
  if (dark) {
    ctx.fillStyle = "#ffffff";
    for (let k = 0; k < 25; k++) {
      const twinkle = 0.5 + 0.5 * Math.sin(time * (0.8 + rand(k, 603) * 2) + k);
      ctx.globalAlpha = 0.8 * twinkle;
      ctx.beginPath();
      ctx.arc(rand(k, 601) * width, rand(k, 602) * height * 0.6, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = pal.cloud;
  for (const c of clouds) {
    for (const [dx, dy, r] of [[0, 0, 26], [28, -10, 22], [52, 2, 24], [24, 8, 26], [-24, 6, 18]]) {
      ctx.beginPath();
      ctx.ellipse(c.x + dx * c.s, c.y + dy * c.s, r * c.s * 1.3, r * c.s * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (!dark) {
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.6;
    ctx.globalAlpha = 0.55;
    for (const b of birds) {
      const flap = Math.sin(time * 7 + b.phase) * 4;
      ctx.beginPath();
      ctx.moveTo(b.x - 8, b.y - flap);
      ctx.quadraticCurveTo(b.x - 4, b.y - 3 - flap * 0.3, b.x, b.y);
      ctx.quadraticCurveTo(b.x + 4, b.y - 3 - flap * 0.3, b.x + 8, b.y - flap);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
};

const cliffBounds = (left, cx, width) =>
  left ? { xMin: 0, xMax: cx + 200 } : { xMin: cx - 200, xMax: width };

// Static rock for one vertical slice of a cliff (world y from k * CHUNK to (k + 1) * CHUNK).
const renderCliffChunk = (ctx, climber, k, { cx, width, pal }) => {
  const { seed, wall } = climber.config;
  const left = wall === "left";
  const worldTop = k * CHUNK;
  const sy = (y) => y - worldTop;
  const edgeX = (wy) => cx + (left ? 1 : -1) * (95 + fbm(wy / 160, seed + 7) * 80);
  const [h, s, l] = pal.rock;
  const { xMin, xMax } = cliffBounds(left, cx, width);

  const edge = [];
  for (let y = -28; y <= CHUNK + 28; y += 14) edge.push({ x: edgeX(y + worldTop), y });
  const outer = left ? xMin - 10 : xMax + 10;
  const cliff = new Path2D();
  cliff.moveTo(outer, -30);
  for (const p of edge) cliff.lineTo(p.x, p.y);
  cliff.lineTo(outer, CHUNK + 30);
  cliff.closePath();

  ctx.save();
  ctx.globalAlpha = pal.cliffShadow;
  ctx.fillStyle = "#0f172a";
  ctx.translate(left ? 10 : -10, 0);
  ctx.fill(cliff);
  ctx.restore();

  ctx.save();
  ctx.clip(cliff);

  const firstCol = Math.floor(xMin / ROCK) - 1;
  const lastCol = Math.ceil(xMax / ROCK) + 1;
  const firstRow = Math.floor(worldTop / ROCK) - 1;
  const lastRow = Math.ceil((worldTop + CHUNK) / ROCK) + 1;
  const vtx = (i, j) => ({
    x: i * ROCK + (rand(i + seed * 3, j + 900) - 0.5) * ROCK * 0.7,
    y: sy(j * ROCK + (rand(i + seed * 3, j + 901) - 0.5) * ROCK * 0.7),
  });
  ctx.lineWidth = 1;
  for (let j = firstRow; j <= lastRow; j++) {
    const strata = Math.sin(j * 0.55 + seed) * 3;
    for (let i = firstCol; i <= lastCol; i++) {
      const a = vtx(i, j);
      const b = vtx(i + 1, j);
      const c = vtx(i, j + 1);
      const d = vtx(i + 1, j + 1);
      [[a, b, d, 0], [a, d, c, 1]].forEach(([p, q, r, t]) => {
        const light = l + strata + (rand(i * 2 + t + seed, j + 77) - 0.5) * 13 + (t === 0 ? 2 : -2);
        ctx.fillStyle = ctx.strokeStyle = `hsl(${h} ${s}% ${light}%)`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.lineTo(r.x, r.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    }
  }

  ctx.strokeStyle = pal.crack;
  ctx.lineWidth = 1.5;
  for (let j = firstRow - 2; j <= lastRow; j++) {
    for (let i = firstCol; i <= lastCol; i++) {
      if (rand(i + seed, j + 333) > 0.09) continue;
      let p = vtx(i, j);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      for (let n = 1; n <= 3; n++) {
        p = { x: p.x + (rand(i + n, j + 444) - 0.5) * 22, y: p.y + 16 + rand(i + n, j + 555) * 12 };
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }

  for (let j = firstRow; j <= lastRow; j++) {
    for (let i = firstCol; i <= lastCol; i++) {
      const v = vtx(i, j);
      if (Math.abs(v.x - cx) < 55) continue;
      const r1 = rand(i + seed, j + 666);
      if (r1 < 0.1) {
        drawKnob(ctx, v.x + 10, v.y + 8, 4 + r1 * 40, i * 31 + j, pal, false);
      } else if (r1 > 0.95) {
        ctx.strokeStyle = pal.grass;
        ctx.lineWidth = 1.6;
        for (let n = -2; n <= 2; n++) {
          ctx.beginPath();
          ctx.moveTo(v.x + n * 2, v.y);
          ctx.quadraticCurveTo(v.x + n * 3, v.y - 6, v.x + n * 5, v.y - 9 - Math.abs(2 - Math.abs(n)) * 2);
          ctx.stroke();
        }
      }
    }
  }

  const firstHold = Math.floor(-(worldTop + CHUNK) / STEP) - 2;
  const lastHold = Math.ceil(-worldTop / STEP) + 2;
  for (let i = firstHold; i <= lastHold; i++) {
    const hold = climber.hold(i);
    drawKnob(ctx, cx + hold.x, sy(hold.y), 7, i * 104729 + seed, pal, true);
  }
  ctx.restore();

  ctx.beginPath();
  edge.forEach((p, n) => (n === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.strokeStyle = pal.edge;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  edge.forEach((p, n) => {
    const x = p.x + (left ? -3 : 3);
    if (n === 0) ctx.moveTo(x, p.y);
    else ctx.lineTo(x, p.y);
  });
  ctx.strokeStyle = pal.rim;
  ctx.lineWidth = 1.5;
  ctx.stroke();
};

const drawClimberLayer = (ctx, climber, { cx, height, colors, climberAlpha }) => {
  const camY = climber.getCamY();
  const left = climber.config.wall === "left";
  const sy = (y) => y - camY + height * 0.5;
  const toScreen = (p) => ({ x: cx + p.x, y: sy(p.y) });
  const worldTop = camY - height * 0.5;
  const hips = toScreen(climber.body.hips);
  const shoulders = toScreen(climber.body.shoulders);

  ctx.save();
  ctx.globalAlpha = climberAlpha;

  const draws = [];
  const clip = climber.getClip();
  const lowestVisible = Math.floor(-(worldTop + height) / STEP) - DRAW_EVERY;
  for (let i = clip; i >= Math.max(0, lowestVisible); i -= DRAW_EVERY) {
    const p = drawPos(i);
    draws.push({ x: cx + p.x, y: sy(p.y) });
  }
  ctx.strokeStyle = left ? "#2563eb" : "#dc2626";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(hips.x, hips.y - 4);
  let prev = { x: hips.x, y: hips.y - 4 };
  draws.forEach((d, n) => {
    if (n === 0 && d.y < hips.y) ctx.lineTo(d.x, d.y + 10);
    else ctx.quadraticCurveTo((prev.x + d.x) / 2 + 6, (prev.y + d.y) / 2, d.x, d.y + 10);
    prev = { x: d.x, y: d.y + 10 };
  });
  ctx.quadraticCurveTo(prev.x - 20, (prev.y + height) / 2, prev.x + 10, height + 20);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.dark ? "#cbd5e1" : "#1e293b";
  for (const d of draws) {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y - 4);
    ctx.lineTo(d.x, d.y + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(d.x, d.y - 6, 2.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  const ends = Object.fromEntries(Object.keys(LIMBS).map((k) => [k, toScreen(climber.limbPos[k])]));
  const shapes = buildClimber({
    shoulders,
    hips,
    ends,
    harnessColor: colors.primary,
    outfit: climber.config.outfit,
    ponytail: climber.ponytail && climber.ponytail.map(toScreen),
  });
  ctx.globalAlpha = climberAlpha * (colors.dark ? 0.35 : 0.2);
  paintShapes(ctx, shapes, { offset: 7, color: "#0f172a" });
  ctx.globalAlpha = climberAlpha;
  paintShapes(ctx, shapes, { grow: 3, color: colors.dark ? "#e2e8f0" : "#1e293b" });
  paintShapes(ctx, shapes, {});

  ctx.fillStyle = colors.dark ? "#ffffff" : "#f8fafc";
  for (const p of climber.particles) {
    ctx.globalAlpha = climberAlpha * Math.min(1, p.life) * 0.8;
    ctx.beginPath();
    ctx.arc(cx + p.x, sy(p.y), 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

export const ClimbingBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let colors = {};
    let speedBoost = 0;
    let lastScroll = window.scrollY;
    let scrollUp = 0;
    let time = 0;
    const climbers = CLIMBERS.map(createClimber);
    const clouds = [];
    const birds = [];
    let sky = null;
    let skyKey = "";
    const chunks = new Map();

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      colors = {
        primary: `hsl(${style.getPropertyValue("--primary").trim()})`,
        dark: document.documentElement.classList.contains("dark"),
      };
      skyKey = "";
      chunks.clear();
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      skyKey = "";
      chunks.clear();
      if (clouds.length === 0) {
        for (let k = 0; k < 6; k++) {
          clouds.push({
            x: Math.random() * width,
            y: height * (0.08 + Math.random() * 0.3),
            s: 0.6 + Math.random() * 0.8,
            v: 5 + Math.random() * 10,
          });
        }
        for (let k = 0; k < 3; k++) {
          birds.push({
            x: Math.random() * width,
            y: height * (0.15 + Math.random() * 0.25),
            v: 18 + Math.random() * 12,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const layout = () => {
      const wide = width >= 1280;
      const margin = wide ? (width - 1024) / 4 : width * 0.18;
      return { wide, margin };
    };

    const draw = () => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const pal = scenePalette(colors.dark);
      const { wide, margin } = layout();

      const shift = Math.round(Math.min(window.scrollY * 0.06, height * 0.2));
      const key = `${colors.dark}:${shift}`;
      if (key !== skyKey) {
        if (!sky) sky = {};
        const layer = createLayer(width, height, dpr);
        renderSky(layer.ctx, { width, height, pal, dark: colors.dark, shift });
        sky.canvas = layer.canvas;
        skyKey = key;
      }
      ctx.globalAlpha = 1;
      ctx.drawImage(sky.canvas, 0, 0, width, height);
      drawSkyLife(ctx, { width, height, pal, dark: colors.dark, time, clouds, birds });
      const phone = width < 768;

      const visibleClimbers = wide || width >= 1024 ? climbers : climbers.slice(0, 1);
      for (const climber of visibleClimbers) {
        const left = climber.config.wall === "left";
        const cx = left ? margin : width - margin;
        const camY = climber.getCamY();
        const worldTop = camY - height * 0.5;
        const first = Math.floor(worldTop / CHUNK);
        const last = Math.floor((worldTop + height) / CHUNK);
        const { xMin, xMax } = cliffBounds(left, cx, width);
        const pad = 16;

        ctx.globalAlpha = wide ? 1 : phone ? 0.3 : 0.45;
        for (let k = first; k <= last; k++) {
          const id = `${climber.config.wall}:${k}`;
          let chunk = chunks.get(id);
          if (!chunk) {
            const layer = createLayer(xMax - xMin + pad * 2, CHUNK, dpr, xMin - pad);
            renderCliffChunk(layer.ctx, climber, k, { cx, width, pal });
            chunk = layer.canvas;
            chunks.set(id, chunk);
          }
          ctx.drawImage(
            chunk,
            xMin - pad,
            Math.round(k * CHUNK - camY + height * 0.5),
            xMax - xMin + pad * 2,
            CHUNK
          );
        }
        for (const id of chunks.keys()) {
          const [wall, k] = id.split(":");
          if (wall === climber.config.wall && (Number(k) < first - 1 || Number(k) > last + 1)) chunks.delete(id);
        }

        drawClimberLayer(ctx, climber, { cx, height, colors, climberAlpha: wide ? 1 : phone ? 0.3 : 0.35 });
      }
      ctx.globalAlpha = 1;
    };

    readColors();
    resize();

    let frame = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      time += dt;
      for (const climber of climbers) climber.update(dt, speedBoost);
      for (const c of clouds) {
        c.x += c.v * dt;
        if (c.x > width + 120) c.x = -120;
      }
      for (const b of birds) {
        b.x += b.v * dt;
        b.y += Math.sin(time * 0.8 + b.phase) * 0.15;
        if (b.x > width + 20) b.x = -20;
      }
      speedBoost *= Math.pow(0.1, dt);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (delta > 0) {
        speedBoost = Math.min(2.5, speedBoost + delta / 200);
        scrollUp = 0;
      } else {
        scrollUp -= delta;
        if (scrollUp > 120) {
          scrollUp = 0;
          if (!reducedMotion) climbers.forEach((climber) => climber.fall());
        }
      }
      if (reducedMotion) draw();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new MutationObserver(() => {
      readColors();
      if (reducedMotion) draw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onResize = () => {
      resize();
      if (reducedMotion) draw();
    };
    window.addEventListener("resize", onResize);

    if (reducedMotion) {
      draw();
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
};

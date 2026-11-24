// Road elements (11-23):
//   road — the buyer's road: step tiles joined by a track, and under each step a column of "what your factory
//          needs" slots. Same data drawn two ways:
//          mode 'full'  — the big board (8 steps as a 4 + 4 snake that fits the 9:16 frame at camera scale 1;
//                         row 2 runs right → left under row 1, the track turns down on the right). When the
//                         slots come in (expand), row 2 slides down to make room for row 1's slots.
//          mode 'strip' — one glass strip of 8 docked on the chest for revisits (like ep01's ladder)
//   span — a glass card with a time span on a track: 开始做 → 第一单, the length written above the track
// Timed state lists, latest entry per index wins:
//   on: [[t, i, s]]   step i:  0 grey · 1 lit · 2 faded (a step this buyer skips)
//   has: [[t, j, s]]  slot j:  0 hidden · 1 empty slot · 2 filled · 3 filled + check · 4 hollow (named, but most factories lack it)
//   expand: [[t, 0|1]] (full) row 2 down to make room for the slots
//   focus: [[t, i | [a, b] | -1]]   ring around step i (or a..b on the strip); -1 = none
//   walk: [{img, t, out?, path: [[t, pos, d?]]}]   a buyer token standing on a step (pos fractional while moving)
//   skip: [[t0, t1, a, b]] (strip)   arc over the road from step a to b (this buyer jumps straight there)
//   tags: [{t, out?, i, txt, dx?, dy?, strike?}]   a small pill above step i (验厂 · 报告, 半年, 模板)
//   marks: [{t, out?, i, src, dx?, dy?, w?, h?, rot?}]   a photo / screenshot pinned above step i (开发信, 展会)
//   brk: [{t, out?, a, b, l, c?}] (strip)   a bracket round slot columns a..b with a label on top (外贸公司)
import React from 'react';
import {Img} from 'remotion';
import {back, clamp, eio, eout, F, img, lerp, prog} from './lib';

const Y = '#f8f56b', GR = '#46c37b', INK = '#f6f3e8';
const GLASS = {
  background: 'linear-gradient(160deg,rgba(38,40,52,.84),rgba(12,13,19,.92))',
  border: '1.5px solid rgba(255,255,255,.30)',
  boxShadow: '0 26px 60px rgba(0,0,0,.55), inset 0 1.5px 0 rgba(255,255,255,.22)',
};

// current / previous state of item i and how far the switch has gone
const stateAt = (xs: any[] | undefined, t: number, i: number, d0: number, d = 0.35) => {
  let cur = d0, prev = d0, t0 = -1e9;
  for (const x of [...(xs ?? [])].filter((x) => x[1] === i).sort((a, b) => a[0] - b[0])) if (t + 1e-6 >= x[0]) {prev = cur; cur = x[2]; t0 = x[0];}
  return {cur, prev, p: eout(prog(t, t0, d))};
};
const amt = (s: {cur: number; prev: number; p: number}, f: (v: number) => number) => lerp(f(s.prev), f(s.cur), s.p);
const latest = (xs: any[] | undefined, t: number) => {
  let c: any = null;
  for (const x of xs ?? []) if (t + 1e-6 >= x[0]) c = x;
  return c;
};
const posAt = (path: any[], t: number) => {
  let x = path[0][1];
  for (const [t0, p, d] of path) {
    if (t < t0) break;
    x = lerp(x, p, eio(prog(t, t0, d ?? 0.8)));
  }
  return x;
};
const levelAt = (xs: any[] | undefined, t: number, d = 0.8) => {
  let v = 0;
  for (const [t0, to] of xs ?? []) if (t >= t0) v = lerp(v, to, eio(prog(t, t0, d)));
  return v;
};
const inWin = (o: any, t: number) => t >= o.t && (o.out == null || t <= o.out + 0.35);
const winOp = (o: any, t: number, d = 0.3) => eout(prog(t, o.t, d)) * (o.out != null ? 1 - eout(prog(t, o.out, 0.3)) : 1);

const Check: React.FC<{s: number; p: number}> = ({s, p}) => (
  <div style={{width: s, height: s, borderRadius: '50%', background: GR, boxShadow: '0 4px 10px rgba(0,0,0,.45)', transform: `scale(${back(p).toFixed(3)})`, opacity: clamp(p * 3),
    display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg width={s * 0.62} height={s * 0.62} viewBox="0 0 20 20"><path d="M3 10.5 L8 15 L17 5" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

export const Road: React.FC<any> = ({e, t}) => {
  const strip = e.mode === 'strip';
  const steps = e.steps as any[], stuff = (e.stuff ?? []) as any[], n = steps.length;
  const half = Math.ceil(n / 2);
  // geometry
  const pad = strip ? 14 : 0;
  const cw = strip ? ((e.w ?? 1060) - pad * 2) / n : (e.cw ?? 250);
  const W = strip ? (e.w ?? 1060) : half * cw;
  const tw = strip ? cw - 8 : (e.tw ?? 230);                 // step tile width
  const ih = strip ? (e.ih ?? 70) : (e.ih ?? 150);            // icon height
  const ls = strip ? (e.ls ?? 25) : (e.ls ?? 42);             // step label size
  const th = strip ? ih + ls + 12 : ih + ls + 40;              // tile height
  const sw = strip ? cw - 8 : (e.sw ?? 230), sh = strip ? 42 : (e.sh ?? 150), sg = strip ? 5 : 16;
  const ss = strip ? (e.ss ?? 20) : (e.ss ?? 34);              // slot label size
  const sgap = strip ? 10 : 40;                                 // tile → first slot
  const colOf = (i: number) => (strip ? i : i < half ? i : n - 1 - i);
  const rowOf = (i: number) => (strip ? 0 : i < half ? 0 : 1);
  const colN = (i: number) => stuff.filter((s) => s.i === i).length;
  const maxA = Math.max(0, ...steps.map((_, i) => (rowOf(i) === 0 ? colN(i) : 0)));
  const maxB = Math.max(0, ...steps.map((_, i) => (rowOf(i) === 1 ? colN(i) : 0)));
  const yB0 = th + (e.rowGap ?? 110), yB1 = th + sgap + maxA * (sh + sg) + (e.gapB ?? 54);
  const slots = (e.has ?? []).length > 0;
  const ex = strip ? 0 : levelAt(e.expand, t);
  const yB = lerp(yB0, yB1, ex);
  const H = strip ? (e.h ?? (slots ? pad + th + sgap + Math.max(1, maxA) * (sh + sg) + pad - sg + 4 : pad * 2 + th + 4)) : yB1 + th + sgap + maxB * (sh + sg);
  const px = (i: number) => pad + cw * colOf(i) + cw / 2;       // step centre x
  const py = (i: number) => pad + (rowOf(i) ? yB : 0);          // step tile top y
  const iyo = strip ? 2 : 18;                                   // icon top inside the tile
  const ry = (i: number) => py(i) + iyo + ih / 2;               // track y through step i
  const steps_ = steps.map((_, i) => stateAt(e.on, t, i, 0));
  const litA = steps_.map((s) => amt(s, (v) => (v === 1 ? 1 : 0)));
  const fadeA = steps_.map((s) => amt(s, (v) => (v === 2 ? 1 : 0)));
  const f = latest(e.focus, t), fsel = f ? f[1] : -1, fp = f ? eout(prog(t, f[0], 0.3)) : 0;
  // walker / mark position between steps (fractional pos)
  const at = (pos: number) => {
    const a = Math.max(0, Math.min(n - 1, Math.floor(pos))), b = Math.min(n - 1, a + 1), u = pos - a;
    return {x: lerp(px(a), px(b), u), y: lerp(py(a), py(b), u)};
  };
  // track segment from step i to i+1 (full mode turns down on the right between the rows)
  const seg = (i: number) => {
    const x0 = px(i), y0 = ry(i), x1 = px(i + 1), y1 = ry(i + 1);
    if (rowOf(i) === rowOf(i + 1)) return `M${x0} ${y0} L${x1} ${y1}`;
    const xr = W + 16, r = 34;
    return `M${x0} ${y0} H${xr - r} Q${xr} ${y0} ${xr} ${y0 + r} V${y1 - r} Q${xr} ${y1} ${xr - r} ${y1} H${x1}`;
  };
  const colIdx: Record<number, number> = {};
  const slotK = stuff.map((s) => {const k = colIdx[s.i] ?? 0; colIdx[s.i] = k + 1; return k;});
  const sw_ = strip ? 4 : 10, sl_ = strip ? 5 : 12;
  return (
    <div style={{position: 'relative', width: W, height: H, borderRadius: strip ? 26 : 0, ...(strip ? GLASS : {})}}>
      {/* track */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {steps.slice(0, -1).map((_, i) => {
          const fill = Math.min(litA[i], litA[i + 1]);
          return (
            <g key={'r' + i}>
              <path d={seg(i)} fill="none" stroke="rgba(255,255,255,.24)" strokeWidth={sw_} strokeDasharray={strip ? '2 9' : '4 18'} strokeLinecap="round" />
              {fill > 0.01 && <path d={seg(i)} fill="none" stroke={Y} strokeWidth={sl_} strokeLinecap="round" opacity={0.9} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - fill} />}
            </g>
          );
        })}
        {(e.skip ?? []).map(([a0, a1, a, b]: number[], k: number) => {
          const p = Math.min(eio(prog(t, a0, 0.6)), 1 - prog(t, a1, 0.3));
          if (p <= 0) return null;
          const x0 = px(a), x1 = px(b), yy = py(a) - (strip ? 6 : 20), hh = strip ? 46 : 120;
          const d = `M${x0} ${yy} C${x0} ${yy - hh}, ${x1} ${yy - hh}, ${x1} ${yy}`;
          return (
            <g key={'s' + k} opacity={clamp(p * 3)}>
              <path d={d} fill="none" stroke={Y} strokeWidth={strip ? 4 : 9} strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - Math.min(1, p)} strokeLinecap="round" />
              {p > 0.95 && <polygon points={`${x1},${yy + 2} ${x1 - (strip ? 9 : 20)},${yy - (strip ? 14 : 30)} ${x1 + (strip ? 9 : 20)},${yy - (strip ? 14 : 30)}`} fill={Y} />}
            </g>
          );
        })}
      </svg>
      {/* step tiles */}
      {steps.map((s, i) => {
        const lit = litA[i], fd = fadeA[i];
        const op = (0.42 + 0.58 * lit) * (1 - 0.55 * fd);
        const iw = strip ? ih * 1.25 : tw - 24;
        return (
          <div key={'t' + i} style={{position: 'absolute', left: px(i) - tw / 2, top: py(i), width: tw, height: th, borderRadius: strip ? 14 : 26,
            background: strip ? 'transparent' : `rgba(20,21,28,${(0.62 + 0.2 * lit).toFixed(2)})`, border: strip ? undefined : `2px solid rgba(255,255,255,${(0.14 + 0.2 * lit).toFixed(2)})`,
            boxShadow: strip ? undefined : '0 18px 40px rgba(0,0,0,.45)'}}>
            <Img src={img(s.img)} style={{position: 'absolute', left: (tw - iw) / 2, top: iyo, width: iw, height: ih, objectFit: 'contain', opacity: op,
              filter: `grayscale(${(1 - lit).toFixed(2)}) drop-shadow(0 ${strip ? 5 : 10}px ${strip ? 7 : 14}px rgba(0,0,0,.5))`, transform: `scale(${(1 + 0.2 * lit * (1 - lit)).toFixed(3)})`}} />
            <div style={{position: 'absolute', left: -20, right: -20, top: iyo + ih + (strip ? 2 : 12), textAlign: 'center', fontFamily: F.ys, fontSize: ls, lineHeight: 1.1, whiteSpace: 'nowrap',
              color: lit > 0.5 ? Y : INK, opacity: (0.45 + 0.55 * lit) * (1 - 0.5 * fd), textDecoration: fd > 0.5 ? 'line-through' : undefined}}>{s.l}</div>
          </div>
        );
      })}
      {/* focus ring */}
      {fsel !== -1 && fp > 0 && (() => {
        const [a, b] = Array.isArray(fsel) ? fsel : [fsel, fsel];
        const xs = [px(a), px(b)], x0 = Math.min(...xs) - cw / 2 + (strip ? 2 : 6), x1 = Math.max(...xs) + cw / 2 - (strip ? 2 : 6);
        return <div style={{position: 'absolute', left: x0, top: py(a) - (strip ? 6 : 12), width: x1 - x0, height: th + (strip ? 10 : 24), borderRadius: strip ? 16 : 30,
          border: `${strip ? 3 : 5}px solid ${Y}`, boxShadow: `0 0 ${strip ? 18 : 36}px rgba(248,245,107,.35)`, opacity: fp}} />;
      })()}
      {/* slots: what the factory needs at each step */}
      {stuff.map((s, j) => {
        const st = stateAt(e.has, t, j, 0);
        const vis = amt(st, (v) => (v > 0 ? 1 : 0)), fill = amt(st, (v) => (v === 2 || v === 3 ? 1 : v === 4 ? 0.3 : 0)), chk = st.cur === 3 ? st.p : st.prev === 3 ? 1 - st.p : 0;
        if (vis <= 0.01) return null;
        const x = px(s.i), y = py(s.i) + th + sgap + slotK[j] * (sh + sg);
        const icon = strip ? sh - 10 : sh - ss - 30;
        return (
          <div key={'u' + j} style={{position: 'absolute', left: x - sw / 2, top: y, width: sw, height: sh, opacity: vis, transform: `translateY(${((1 - vis) * 16).toFixed(1)}px)`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: strip ? 9 : 18, border: `${strip ? 1.5 : 2.5}px dashed rgba(255,255,255,${(0.42 * (1 - fill)).toFixed(2)})`}} />
            <div style={{position: 'absolute', inset: 0, borderRadius: strip ? 9 : 18, background: 'linear-gradient(180deg,#fbfaf6,#e9e6dc)', opacity: fill, boxShadow: fill > 0.5 ? '0 10px 22px rgba(0,0,0,.4)' : undefined}} />
            {strip ? (
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 3, padding: '0 4px'}}>
                <Img src={img(s.img)} style={{width: icon, height: icon, objectFit: 'contain', opacity: 0.25 + 0.75 * fill, filter: fill < 0.5 ? 'grayscale(1) brightness(1.6)' : undefined, flexShrink: 0}} />
                <div style={{fontFamily: F.ys, fontSize: ss, whiteSpace: 'nowrap', color: fill > 0.5 ? '#26252b' : 'rgba(246,243,232,.62)'}}>{s.l}</div>
              </div>
            ) : (
              <>
                <Img src={img(s.img)} style={{position: 'absolute', left: 12, top: 10, width: sw - 24, height: icon, objectFit: 'contain', opacity: 0.2 + 0.8 * fill, filter: fill < 0.5 ? 'grayscale(1) brightness(1.7)' : 'drop-shadow(0 6px 8px rgba(0,0,0,.25))'}} />
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', fontFamily: F.ys, fontSize: ss, whiteSpace: 'nowrap', color: fill > 0.5 ? '#26252b' : 'rgba(246,243,232,.62)'}}>{s.l}</div>
              </>
            )}
            {chk > 0 && <div style={{position: 'absolute', right: strip ? -8 : -14, top: strip ? -8 : -14}}><Check s={strip ? 22 : 46} p={chk} /></div>}
          </div>
        );
      })}
      {/* bracket over slot columns */}
      {(e.brk ?? []).map((b: any, k: number) => {
        if (!inWin(b, t)) return null;
        const op = winOp(b, t), x0 = px(b.a) - cw / 2 + 3, x1 = px(b.b) + cw / 2 - 3, y0 = py(b.a) + th + sgap - (strip ? 6 : 14), y1 = H - (strip ? 6 : 0);
        return (
          <React.Fragment key={'b' + k}>
            <div style={{position: 'absolute', left: x0, top: y0, width: x1 - x0, height: y1 - y0, borderRadius: strip ? 12 : 24, border: `${strip ? 3 : 5}px solid ${b.c ?? '#7fb6ff'}`, opacity: op}} />
            <div style={{position: 'absolute', left: (x0 + x1) / 2, top: y0, transform: 'translate(-50%,-55%)', padding: strip ? '2px 12px' : '4px 22px', borderRadius: 12, background: b.c ?? '#7fb6ff',
              fontFamily: F.ys, fontSize: strip ? 22 : 40, color: '#10131c', whiteSpace: 'nowrap', opacity: op}}>{b.l}</div>
          </React.Fragment>
        );
      })}
      {/* pills above a step */}
      {(e.tags ?? []).map((g: any, k: number) => {
        if (!inWin(g, t)) return null;
        const p = winOp(g, t);
        return <div key={'g' + k} style={{position: 'absolute', left: px(g.i) + (g.dx ?? 0), top: py(g.i) + (g.dy ?? (strip ? -16 : -34)), transform: `translate(-50%,-100%) scale(${lerp(0.7, 1, back(prog(t, g.t, 0.35))).toFixed(3)})`,
          padding: strip ? '2px 12px' : '6px 22px', borderRadius: 12, background: g.bg ?? 'rgba(20,20,26,.82)', border: `${strip ? 1.5 : 2.5}px solid ${g.c ?? Y}`, fontFamily: F.ys, fontSize: strip ? 24 : 44,
          color: g.c ?? Y, whiteSpace: 'nowrap', opacity: p, textDecoration: g.strike != null && t >= g.strike ? 'line-through' : undefined}}>{g.txt}</div>;
      })}
      {/* photos / screenshots pinned above a step */}
      {(e.marks ?? []).map((m: any, k: number) => {
        if (!inWin(m, t)) return null;
        const p = winOp(m, t, 0.35), w = m.w ?? (strip ? 84 : 230), h = m.h ?? w;
        return <Img key={'m' + k} src={img(m.src)} style={{position: 'absolute', left: px(m.i) + (m.dx ?? 0) - w / 2, top: py(m.i) + (m.dy ?? -h - 30) + (1 - p) * 30, width: w, height: h, objectFit: m.fit ?? 'cover', opacity: p,
          borderRadius: strip ? 10 : 18, border: m.bd ?? `${strip ? 3 : 6}px solid #f4f2ec`, boxShadow: '0 14px 30px rgba(0,0,0,.5)', transform: `rotate(${m.rot ?? 0}deg)`, background: m.bg ?? '#f4f2ec'}} />;
      })}
      {/* buyer tokens */}
      {(e.walk ?? []).map((w: any, k: number) => {
        if (!inWin(w, t)) return null;
        const p = winOp(w, t, 0.3), pos = posAt(w.path, t), s = w.s ?? (strip ? 54 : 110), q = at(pos);
        const hop = Math.abs(Math.sin(Math.PI * (pos % 1))) * (strip ? 10 : 26);
        return <Img key={'w' + k} src={img(w.img)} style={{position: 'absolute', left: q.x - s / 2, top: q.y - s * (strip ? 0.62 : 0.6) - hop, width: s, height: s, objectFit: 'cover', objectPosition: '50% 20%', borderRadius: '50%',
          border: `${strip ? 3 : 6}px solid ${Y}`, boxShadow: '0 8px 18px rgba(0,0,0,.55)', opacity: p, background: '#2a2b33'}} />;
      })}
    </div>
  );
};

export const Span: React.FC<any> = ({e, t}) => {
  const w = e.w ?? 1000, h = e.h ?? 250, pad = 90, y = h * 0.6;
  const fp = eio(prog(t, e.ft ?? e.t + 0.3, e.fd ?? 1.2)), vp = eout(prog(t, e.vt ?? e.t + 0.9, 0.4));
  const x0 = pad, x1 = w - pad;
  const node = (x: number, lbl: string, on: number) => (
    <>
      <div style={{position: 'absolute', left: x - 17, top: y - 17, width: 34, height: 34, borderRadius: '50%', background: on > 0.5 ? Y : '#2a2b33', border: `4px solid ${Y}`, boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: x - 120, width: 240, top: y + 26, textAlign: 'center', fontFamily: F.ys, fontSize: e.ls ?? 40, color: INK, whiteSpace: 'nowrap'}}>{lbl}</div>
    </>
  );
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 26, ...GLASS}}>
      <div style={{position: 'absolute', left: x0, top: y - 4, width: x1 - x0, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.18)'}} />
      <div style={{position: 'absolute', left: x0, top: y - 5, width: (x1 - x0) * fp, height: 10, borderRadius: 5, background: Y}} />
      {node(x0, e.a, 1)}
      {node(x1, e.b, fp > 0.98 ? 1 : 0)}
      <div style={{position: 'absolute', left: 0, right: 0, top: y - (e.vs ?? 80) - 30, textAlign: 'center', fontFamily: F.ys, fontSize: e.vs ?? 80, lineHeight: 1, color: Y, whiteSpace: 'nowrap',
        opacity: vp, transform: `translateY(${((1 - vp) * 20).toFixed(1)}px)`}}>{e.v}</div>
    </div>
  );
};

export const ROAD_ELS: any = {road: Road, span: Span};

// dial (11-23, 小Lin 竖屏深拆 #25 底部转盘指当前这一项):
//   the top half of a dial at the bottom of the frame; the current item sits at 12 o'clock, big and lit, the others run
//   round the rim, dim. When the speaker moves to the next item the dial turns one notch (step°, 0.35 s) while the main
//   picture above shows that item's real thing. It only says "which item we are on", so the picture can change every second.
// props: items [{l, t}]  (t = when this item becomes current; before items[0].t the dial shows items[0] unlit)
//        w (box width, default 1080), h (visible height, default 470), r (radius, default 450), step (deg, default 32)
//        size (current label px, default 96), dsize (other labels, default 46), en (optional small English under the current one)
// Place it with layer='screen' at x=540, y=1920 - h/2 (the box is w × h; the circle centre is below the box bottom edge).
import React from 'react';
import {clamp, eio, eout, F, prog} from './lib';

const Y = '#f8f56b', INK = '#f6f3e8';

export const Dial: React.FC<any> = ({e, t}) => {
  const items = e.items as any[], n = items.length;
  const w = e.w ?? 1080, h = e.h ?? 470, r = e.r ?? 450, step = e.step ?? 32, size = e.size ?? 96, ds = e.dsize ?? 46;
  const cx = w / 2, cy = r + 30;                      // circle centre (box coords): the box shows the top h px of the dial
  // fractional current index: eases from one item to the next over 0.35 s
  let pos = 0;
  for (let i = 1; i < n; i++) if (t >= items[i].t) pos = (i - 1) + eio(prog(t, items[i].t, 0.35));
  const lit0 = eout(prog(t, items[0].t, 0.3));
  const rot = -pos * step;
  const ticks = [];
  for (let a = -180; a <= 180; a += 4) {
    const th = ((a + rot * 1) - 90) * Math.PI / 180, big = a % step === 0;
    const r0 = r - (big ? 34 : 18), r1 = r - 4;
    ticks.push(<line key={a} x1={cx + r0 * Math.cos(th)} y1={cy + r0 * Math.sin(th)} x2={cx + r1 * Math.cos(th)} y2={cy + r1 * Math.sin(th)}
      stroke={big ? 'rgba(248,245,107,.75)' : 'rgba(246,243,232,.35)'} strokeWidth={big ? 4 : 2} strokeLinecap="round" />);
  }
  return (
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden'}}>
      <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="dialg" cx="50%" cy="50%" r="50%">
            <stop offset="0.55" stopColor="rgba(14,16,24,.55)" />
            <stop offset="0.93" stopColor="rgba(26,30,44,.92)" />
            <stop offset="1" stopColor="rgba(60,66,86,.95)" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="url(#dialg)" stroke="rgba(255,255,255,.28)" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={r - 150} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth={2} />
        {ticks}
        {/* the pointer: a notch at 12 o'clock */}
        <polygon points={`${cx - 22},${cy - r - 26} ${cx + 22},${cy - r - 26} ${cx},${cy - r + 8}`} fill={Y} opacity={0.4 + 0.6 * lit0} />
      </svg>
      {items.map((it: any, i: number) => {
        const d = i - pos;                                // 0 = current
        const ang = (d * step - 90) * Math.PI / 180, rl = r - 96;
        const x = cx + rl * Math.cos(ang), y = cy + rl * Math.sin(ang);
        if (y > h + 60) return null;
        const near = clamp(1 - Math.abs(d)), cur = near * (i === 0 ? lit0 : 1);
        const fs = ds + (size - ds) * near;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${d * step}deg)`, whiteSpace: 'nowrap', textAlign: 'center',
            fontFamily: F.ys, fontSize: fs, lineHeight: 1, color: cur > 0.5 ? Y : INK, opacity: Math.max(cur, 0.3, 0.75 - 0.2 * Math.abs(d)),
            textShadow: cur > 0.5 ? '0 0 24px rgba(248,245,107,.45), 0 6px 14px rgba(0,0,0,.6)' : '0 4px 10px rgba(0,0,0,.6)'}}>
            {it.l}
            {it.en && near > 0.6 && <div style={{fontFamily: F.en, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: 'rgba(246,243,232,.6)', marginTop: 8}}>{it.en}</div>}
          </div>
        );
      })}
    </div>
  );
};

export const DIAL_ELS: any = {dial: Dial};

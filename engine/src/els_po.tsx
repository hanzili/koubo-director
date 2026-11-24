// Presenter + overlay elements (her full-frame presenter shots, docs/小Lin风格规格.md 5b):
//   chest  — glass card on the chest: a photo / logo / prop on top, Chinese word + one small English line, or a big number
//   ladder — the price-ladder board docked on the chest as one row (her 账本行 under her while she talks)
//   behind — a huge number painted BEHIND the presenter (scene el with behind: true; Main.tsx puts the person matte on top)
import React from 'react';
import {Img} from 'remotion';
import {clamp, eout, F, img, prog} from './lib';

const GLASS = {
  background: 'linear-gradient(160deg,rgba(38,40,52,.82),rgba(12,13,19,.90))',
  border: '1.5px solid rgba(255,255,255,.30)',
  boxShadow: '0 26px 60px rgba(0,0,0,.55), inset 0 1.5px 0 rgba(255,255,255,.22)',
};
const Glare: React.FC<{r: number}> = ({r}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '42%', borderRadius: `${r}px ${r}px 0 0`, background: 'linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,0))', pointerEvents: 'none'}} />
);
const CJK = /[㐀-鿿＀-￯]/;

export const Chest: React.FC<any> = ({e}) => {
  const w = e.w ?? 300, h = e.h ?? 340, r = 24, pad = 14;
  const ih = e.src ? (e.ih ?? Math.round(h * 0.58)) : 0;
  const contain = e.fit === 'contain';
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: r, overflow: 'hidden', ...GLASS}}>
      <Glare r={r} />
      {e.src && (
        <div style={{position: 'absolute', left: pad, right: pad, top: pad, height: ih, borderRadius: 14, overflow: 'hidden', background: contain ? (e.ibg ?? 'rgba(246,244,238,.94)') : '#1b1b20'}}>
          <Img src={img(e.src)} style={{width: '100%', height: '100%', objectFit: contain ? 'contain' : 'cover', objectPosition: e.pos ?? '50% 40%', padding: contain ? (e.ipad ?? 16) : 0, boxSizing: 'border-box', display: 'block'}} />
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: ih ? ih + pad : 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2}}>
        {e.word && <div style={{fontFamily: F.ys, fontSize: e.size ?? 50, color: '#f6f3e8', letterSpacing: 3, whiteSpace: 'nowrap', lineHeight: 1.1}}>{e.word}</div>}
        {e.num && (
          <div style={{display: 'flex', alignItems: 'baseline', gap: 6, lineHeight: 1}}>
            {Array.from(String(e.num)).map((c, i) => (
              <span key={i} style={{fontFamily: CJK.test(c) ? F.ys : F.num, fontSize: (e.nsize ?? 120) * (CJK.test(c) ? 0.5 : c === '¥' || c === '$' ? 0.62 : 1), color: e.nc ?? '#f8f56b'}}>{c}</span>
            ))}
          </div>
        )}
        {e.en && <div style={{fontFamily: F.en, fontWeight: 700, fontSize: e.ensize ?? 17, letterSpacing: 2.4, color: 'rgba(255,255,255,.55)', whiteSpace: 'nowrap', marginTop: 4}}>{e.en}</div>}
      </div>
    </div>
  );
};

// latest value at time t from [[t, ...rest]] lists
const at = (xs: any[] | undefined, t: number) => {
  let cur: any = null;
  for (const x of xs ?? []) if (t + 1e-6 >= x[0]) cur = x;
  return cur;
};

export const Ladder: React.FC<any> = ({e, t}) => {
  const w = e.w ?? 1000, h = e.h ?? 300, r = 26, pad = 22, n = e.cells.length, cw = (w - pad * 2) / n;
  const f = at(e.focus, t), sel = f ? f[1] : -1;
  const on = (i: number) => sel === -1 || sel === i || (Array.isArray(sel) && i >= sel[0] && i <= sel[1]);
  const ix = (i: number) => pad + cw * i + cw / 2;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: r, ...GLASS}}>
      <Glare r={r} />
      {e.cells.slice(0, -1).map((_: any, i: number) => (
        <div key={'a' + i} style={{position: 'absolute', left: pad + cw * (i + 1) - 11, top: 72, fontFamily: F.en, fontWeight: 700, fontSize: 30, color: 'rgba(255,255,255,.35)'}}>›</div>
      ))}
      {e.cells.map((c: any, i: number) => {
        const lit = on(i), pr = at((e.prices ?? []).filter((p: any) => p[1] === i), t);
        return (
          <div key={i} style={{position: 'absolute', left: ix(i) - cw / 2, top: 0, width: cw, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: lit ? 1 : 0.38, filter: lit ? undefined : 'grayscale(.7)', transition: 'none'}}>
            {c.q
              ? <div style={{height: 118, marginTop: 18, display: 'flex', alignItems: 'center', fontFamily: F.ys, fontSize: 104, color: 'rgba(246,243,232,.78)'}}>?</div>
              : <Img src={img(c.img)} style={{height: 118, width: cw - 26, objectFit: 'contain', marginTop: 18, filter: 'drop-shadow(0 10px 14px rgba(0,0,0,.5))'}} />}
            <div style={{fontFamily: F.ys, fontSize: 33, color: '#f6f3e8', marginTop: 6, whiteSpace: 'nowrap'}}>{c.l}</div>
            {pr && (
              <div style={{marginTop: 8, padding: '2px 16px', borderRadius: 12, background: pr[3] ? 'rgba(255,107,94,.18)' : 'rgba(248,245,107,.14)', border: `1.5px solid ${pr[3] ?? 'rgba(248,245,107,.6)'}`,
                fontFamily: F.num, fontSize: 48, lineHeight: 1.12, color: pr[3] ?? '#f8f56b', opacity: eout(prog(t, pr[0], 0.3))}}>{pr[2]}</div>
            )}
          </div>
        );
      })}
      {(e.hi ?? []).map(([a0, a1, a, b]: number[], k: number) => {
        const p = Math.min(prog(t, a0, 0.3), 1 - prog(t, a1, 0.25));
        if (p <= 0) return null;
        return <div key={'h' + k} style={{position: 'absolute', left: ix(a) - cw / 2 + 6, top: 8, width: cw * (b - a + 1) - 12, height: h - 16, borderRadius: 18, border: '3px solid #f8f56b', boxShadow: '0 0 26px rgba(248,245,107,.35)', opacity: eout(p)}} />;
      })}
      {(e.marks ?? []).map((m: any, k: number) => {
        if (t < m.t || (m.out != null && t > m.out + 0.3)) return null;
        const op = eout(prog(t, m.t, 0.3)) * (m.out != null ? 1 - eout(prog(t, m.out, 0.25)) : 1);
        return <Img key={'m' + k} src={img(m.src)} style={{position: 'absolute', left: ix(m.i) + (m.dx ?? 52), top: m.dy ?? 14, width: m.w ?? 84, height: m.w ?? 84, objectFit: 'contain', opacity: op,
          background: m.bg ?? 'rgba(246,244,238,.95)', borderRadius: 14, padding: 6, boxSizing: 'border-box', boxShadow: '0 8px 18px rgba(0,0,0,.45)'}} />;
      })}
      {(e.walk ?? []).map(([w0, a, b, d]: number[], k: number) => {
        const nxt = (e.walk[k + 1] ?? [1e9])[0];
        if (t < w0 || t >= nxt) return null;
        const p = eout(prog(t, w0 + 0.15, d ?? 0.8)), x = ix(a) + (ix(b) - ix(a)) * p;
        return <Img key={'w' + k} src={img(e.walker)} style={{position: 'absolute', left: x - 46 - 40, top: 74, width: 92, height: 92, objectFit: 'contain', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,.55))', opacity: clamp(prog(t, w0, 0.2) * 1.5)}} />;
      })}
    </div>
  );
};

export const Behind: React.FC<any> = ({e}) => {
  const s = e.size ?? 700, c = e.c ?? '#7c1016', cj = e.cjk ?? 0.3;   // cjk: size of CJK glyphs relative to digits (1 when the number is all CJK, e.g. 几十万)
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap', lineHeight: 0.82, opacity: e.alpha ?? 0.93}}>
      {e.pre && <span style={{fontFamily: F.num, fontSize: s * 0.36, color: c, marginRight: s * 0.03, marginBottom: s * 0.1}}>{e.pre}</span>}
      {Array.from(String(e.v)).map((ch, i) => (
        <span key={i} style={{fontFamily: CJK.test(ch) ? F.ys : F.num, fontSize: CJK.test(ch) ? s * cj : s, color: c, marginLeft: CJK.test(ch) && cj < 0.9 ? s * 0.03 : 0, marginBottom: CJK.test(ch) && cj < 0.9 ? s * 0.08 : 0}}>{ch}</span>
      ))}
      {e.unit && <span style={{fontFamily: F.ys, fontSize: s * 0.22, color: c, marginLeft: s * 0.04, marginBottom: s * 0.08}}>{e.unit}</span>}
    </div>
  );
};

export const PO_ELS: any = {chest: Chest, ladder: Ladder, behind: Behind};

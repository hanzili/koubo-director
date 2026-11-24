// els_story.tsx (2026-11-24): Wave-1 Storytelling Components (8 primitives, fully skin-aware via skin_tokens.ts).
//   1. chain_card   — 3D perspective causal chain board with alternating dashed arrows & progressive reveal
//   2. dossier_grid — Accent-striped dossier cards with prop breakout & big KPI numbers
//   3. ledger_board — Persistent matrix board flipping '?' -> ✓/✗/value on spoken cues
//   4. orb_ring     — Floating glass orbs with progressive pop-in & dynamic focus/dim
//   5. split_bars   — Animated stacked & split cost/profit comparison bars with top non-overlapping callout
//   6. phone_chart  — Smartphone card housing growing bar chart or progressive list
//   7. ruler_track  — Physical graduated timeline track with glowing needle & persistent milestones
//   8. hero_pillars — Translucent vertical pillars with optional bullet points & props
import React from 'react';
import {Img} from 'remotion';
import {back, clamp, eio, eout, fmt, img, lerp, prog} from './lib';
import {getSkin, getSwatch, PAL_ORDER} from './skin_tokens';

// ================================================================ 1. chain_card
export const ChainCard: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 860, items = (e.items || []) as any[], n = items.length;
  const rowH = e.rh ?? (n >= 5 ? 142 : 162), gap = e.gap ?? 24;
  const padX = 56, padTop = e.title ? 146 : 44, padBot = 46;
  const h = padTop + n * rowH + Math.max(0, n - 1) * gap + padBot;
  const tilt = e.tilt ?? (sk.name === 'editorial' ? 0 : -5.5);
  const cardW = w - padX * 2;
  const arrowCol = sk.mode === 'light' ? sk.ink : 'rgba(245,230,196,.82)';
  return (
    <div style={{
      width: w, height: h, position: 'relative',
      transform: tilt ? `perspective(1400px) rotateY(${tilt}deg)` : undefined,
      borderRadius: sk.radius,
      background: sk.surface,
      border: `2px solid ${sk.borderStrong}`,
      boxShadow: sk.shadow,
      overflow: 'visible',
    }}>
      {e.title && (
        <div style={{position: 'absolute', top: 34, left: 0, right: 0, textAlign: 'center'}}>
          <div style={{fontFamily: sk.fontTitle, fontSize: e.ts ?? 50, color: sk.ink, letterSpacing: 2}}>
            <span style={{color: sk.accent, marginRight: 16}}>—</span>
            {e.title}
            <span style={{color: sk.accent, marginLeft: 16}}>—</span>
          </div>
          {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkDim, marginTop: 6, letterSpacing: 1}}>{e.sub}</div>}
          <div style={{width: cardW, height: 1.5, margin: '18px auto 0', background: sk.divider}} />
        </div>
      )}
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
        <defs>
          <marker id={`ch_arr_${sk.name}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 1 1 L 9 5 L 1 9 z" fill={arrowCol} />
          </marker>
        </defs>
        {items.slice(0, -1).map((it: any, i: number) => {
          const next = items[i + 1];
          const p = eout(prog(t, (next.t ?? e.t) - 0.15, 0.45));
          const leftSide = i % 2 === 0;
          const y1 = padTop + i * (rowH + gap) + rowH * 0.52;
          const y2 = padTop + (i + 1) * (rowH + gap) + rowH * 0.48;
          const xEdge = leftSide ? padX - 2 : w - padX + 2;
          const xCtrl = leftSide ? padX - 78 : w - padX + 78;
          const d = `M ${xEdge} ${y1} C ${xCtrl} ${y1}, ${xCtrl} ${y2}, ${xEdge} ${y2}`;
          return (
            <path key={i} d={d} fill="none" stroke={arrowCol} strokeWidth={3.5}
              strokeDasharray="9 8" markerEnd={`url(#ch_arr_${sk.name})`} opacity={0.22 + 0.78 * p} />
          );
        })}
      </svg>
      {items.map((it: any, i: number) => {
        const y = padTop + i * (rowH + gap);
        const rev = prog(t, it.t ?? e.t, 0.4);
        const revE = eout(rev);
        const isLatest = rev > 0 && (i === n - 1 || t < (items[i + 1].t ?? 1e9));
        const sw = getSwatch(sk, it.c || PAL_ORDER[i % PAL_ORDER.length]);
        return (
          <div key={i} style={{
            position: 'absolute', left: padX, top: y, width: cardW, height: rowH,
            borderRadius: sk.radiusSm,
            background: rev > 0 ? sw.bg : sk.surfaceMuted,
            border: rev > 0
              ? `${isLatest ? 2.5 : 1.5}px solid ${isLatest ? sw.rim : sk.border}`
              : `1.5px dashed ${sk.border}`,
            boxShadow: isLatest ? `${sk.shadowSm}, 0 0 22px ${sw.glow}` : sk.shadowSm,
            transform: `scale(${lerp(0.97, isLatest ? 1.02 : 1.0, revE)})`,
            opacity: rev > 0 ? (isLatest ? 1 : 0.82) : 0.45,
            display: 'flex', alignItems: 'center', padding: '0 28px', gap: 22, overflow: 'hidden', boxSizing: 'border-box',
          }}>
            <div style={{
              fontFamily: sk.fontNum, fontSize: Math.round(rowH * 0.62), lineHeight: 1, minWidth: 58,
              color: rev > 0 ? (isLatest ? sw.text : sk.inkSub) : sk.inkDim,
            }}>{i + 1}</div>
            {rev > 0 ? (
              <div style={{flex: 1, minWidth: 0, opacity: revE, transform: `translateX(${(1 - revE) * 18}px)`}}>
                <div style={{fontFamily: sk.fontTitle, fontSize: it.fs ?? 46, color: sk.ink, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{it.l}</div>
                {it.sub && <div style={{fontFamily: sk.fontBody, fontSize: 25, color: sk.inkSub, marginTop: 6, lineHeight: 1.25}}>{it.sub}</div>}
              </div>
            ) : (
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
                <div style={{width: '56%', height: 26, borderRadius: 8, background: sk.surfaceSoft}} />
                <div style={{width: '36%', height: 16, borderRadius: 6, background: sk.surfaceSoft}} />
              </div>
            )}
            {it.img && rev > 0 && (
              <Img src={img(it.img)} style={{
                height: rowH - 20, width: Math.round((rowH - 20) * 1.35), objectFit: 'contain',
                opacity: revE, transform: `scale(${lerp(0.85, 1, back(rev))})`,
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.35))',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ================================================================ 2. dossier_grid
export const DossierGrid: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 940, gap = e.gap ?? 24, cards = (e.cards || []) as any[];
  const halfW = (w - gap) / 2;
  const rows: any[][] = [];
  let cur: any[] = [], used = 0;
  for (const c of cards) {
    const sp = c.span === 2 ? 2 : 1;
    if (used + sp > 2) {rows.push(cur); cur = []; used = 0;}
    cur.push({...c, sp}); used += sp;
    if (used === 2) {rows.push(cur); cur = []; used = 0;}
  }
  if (cur.length) rows.push(cur);
  return (
    <div style={{width: w, position: 'relative', display: 'flex', flexDirection: 'column', gap}}>
      {e.title && (
        <div style={{textAlign: 'center', marginBottom: 4}}>
          <div style={{fontFamily: sk.fontTitle, fontSize: 44, color: sk.ink, letterSpacing: 2}}>{e.title}</div>
          {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkDim, marginTop: 4}}>{e.sub}</div>}
        </div>
      )}
      {rows.map((row, ri) => (
        <div key={ri} style={{display: 'flex', gap, alignItems: 'stretch'}}>
          {row.map((c: any, ci: number) => {
            const p = prog(t, c.t ?? e.t, 0.38);
            if (p <= 0) return <div key={ci} style={{width: c.sp === 2 ? w : halfW, height: c.sp === 2 ? 150 : 230}} />;
            const pe = back(p);
            const sw = getSwatch(sk, c.c || PAL_ORDER[(ri * 2 + ci) % PAL_ORDER.length]);
            const isWide = c.sp === 2;
            const ch = c.h ?? (isWide ? 156 : 242);
            const cw = isWide ? w : halfW;
            return (
              <div key={ci} style={{
                width: cw, height: ch, position: 'relative', borderRadius: sk.radiusSm,
                background: sk.surfaceAlt,
                border: `2px solid ${sk.borderStrong}`,
                boxShadow: sk.shadowSm,
                opacity: clamp(p * 2.5),
                transform: `translateY(${(1 - pe) * 28}px) scale(${lerp(0.94, 1, pe)})`,
                overflow: 'visible',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: isWide ? 112 : 76,
                  borderRadius: `${sk.radiusSm}px 0 0 ${sk.radiusSm}px`, background: sw.bar, opacity: 0.94,
                }} />
                {c.img && (
                  <Img src={img(c.img)} style={{
                    position: 'absolute', left: isWide ? 24 : 10, bottom: 10,
                    height: isWide ? ch + 26 : 148, width: isWide ? 175 : 148,
                    objectFit: 'contain', filter: 'drop-shadow(0 12px 20px rgba(0,0,0,.4))', pointerEvents: 'none',
                  }} />
                )}
                <div style={{
                  position: 'absolute',
                  left: isWide ? (c.img ? 220 : 138) : (c.img ? 162 : 98),
                  right: 24, top: 0, bottom: 0,
                  display: 'flex', flexDirection: isWide ? 'row' : 'column',
                  alignItems: isWide ? 'center' : 'flex-start',
                  justifyContent: isWide ? 'space-between' : 'center',
                  gap: isWide ? 18 : 8,
                }}>
                  <div>
                    <div style={{fontFamily: sk.fontTitle, fontSize: isWide ? 44 : 38, color: sk.ink, lineHeight: 1.15}}>{c.l}</div>
                    {c.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkSub, marginTop: 6, lineHeight: 1.25}}>{c.sub}</div>}
                  </div>
                  {c.val && (
                    <div style={{
                      fontFamily: sk.fontNum, fontSize: isWide ? 72 : 64, lineHeight: 1,
                      color: sw.text, letterSpacing: 1, whiteSpace: 'nowrap',
                    }}>{c.val}</div>
                  )}
                </div>
                {c.badge && (
                  <div style={{
                    position: 'absolute', right: 16, top: -14, padding: '4px 14px', borderRadius: 999,
                    background: sw.solid, color: sw.onSolid, fontFamily: sk.fontBody, fontSize: 20, fontWeight: 800,
                    boxShadow: sk.shadowSm,
                  }}>{c.badge}</div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ================================================================ 3. ledger_board
export const LedgerBoard: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 960, cols = (e.cols || []) as string[], rows = (e.rows || []) as any[];
  const lw = e.lw ?? 255, rh = e.rh ?? 168, gap = 14, pad = 22;
  const colW = (w - pad * 2 - lw) / Math.max(1, cols.length);
  return (
    <div style={{
      width: w, borderRadius: sk.radius, padding: pad, boxSizing: 'border-box',
      background: sk.surface,
      border: `2px solid ${sk.borderStrong}`,
      boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', gap,
    }}>
      <div style={{display: 'flex', alignItems: 'center', paddingBottom: 8, borderBottom: `1.5px solid ${sk.divider}`}}>
        <div style={{width: lw, paddingLeft: 14, fontFamily: sk.fontTitle, fontSize: 34, color: sk.inkSub}}>{e.title || ''}</div>
        {cols.map((c, i) => (
          <div key={i} style={{width: colW, textAlign: 'center', fontFamily: sk.fontTitle, fontSize: 34, color: sk.ink, letterSpacing: 1}}>{c}</div>
        ))}
      </div>
      {rows.map((r: any, ri: number) => {
        const rp = eout(prog(t, r.t ?? e.t, 0.35));
        const sw = getSwatch(sk, r.c || PAL_ORDER[ri % PAL_ORDER.length]);
        return (
          <div key={ri} style={{
            height: rh, borderRadius: sk.radiusSm, background: sw.bg,
            border: `1.5px solid ${sk.border}`,
            display: 'flex', alignItems: 'center', overflow: 'hidden',
            opacity: rp, transform: `translateY(${(1 - rp) * 16}px)`,
          }}>
            <div style={{
              width: lw, height: '100%', padding: '0 20px', boxSizing: 'border-box',
              background: sk.mode === 'light' ? 'rgba(22,22,26,.04)' : 'rgba(0,0,0,.22)',
              borderRight: `1px solid ${sk.divider}`,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{fontFamily: sk.fontTitle, fontSize: 38, color: sk.ink, lineHeight: 1.15}}>{r.l}</div>
              {r.sub && <div style={{fontFamily: sk.fontBody, fontSize: 20, color: sk.inkSub, marginTop: 6}}>{r.sub}</div>}
            </div>
            {(r.cells || []).map((cell: any, ci: number) => {
              const cp = prog(t, cell.t ?? 1e9, 0.32);
              const rev = cp > 0;
              const k = cell.kind || 'num';
              const cellSw = k === 'ok' ? sk.pal.emerald : k === 'bad' ? sk.pal.crimson : k === 'warn' ? sk.pal.amber : sw;
              const fg = k === 'num' ? sk.ink : cellSw.text;
              const pillBg = k === 'num' ? sk.surfaceSoft : (sk.mode === 'light' ? '#fffdf8' : cellSw.glow);
              return (
                <div key={ci} style={{
                  width: colW, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderLeft: ci > 0 ? `1px dashed ${sk.divider}` : undefined,
                }}>
                  {rev ? (
                    <div style={{
                      padding: '10px 18px', borderRadius: 12, background: pillBg,
                      border: `1.5px solid ${cellSw.rim}`,
                      fontFamily: sk.fontTitle, fontSize: (cell.v || '').length > 4 ? 28 : 38, color: fg,
                      transform: `scale(${back(cp)})`, opacity: clamp(cp * 3), textAlign: 'center', lineHeight: 1.15,
                    }}>{cell.v}</div>
                  ) : (
                    <div style={{
                      width: 68, height: 68, borderRadius: 999,
                      background: sk.surfaceSoft, border: `1px solid ${sk.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: sk.fontNum, fontSize: 40, color: sk.inkDim,
                    }}>?</div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ================================================================ 4. orb_ring
export const OrbRing: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 960, h = e.h ?? 960, orbs = (e.orbs || []) as any[];
  return (
    <div style={{width: w, height: h, position: 'relative', pointerEvents: 'none'}}>
      {orbs.map((o: any, i: number) => {
        const p = prog(t, o.t ?? e.t, 0.42);
        if (p <= 0) return null;
        const pe = back(p);
        const r = o.r ?? 126;
        const sw = getSwatch(sk, o.c || PAL_ORDER[i % PAL_ORDER.length]);
        const floatY = Math.sin(t * 2.1 + i * 1.4) * 7;
        const isLit = o.focusT != null && t >= o.focusT && (o.dimT == null || t < o.dimT);
        const isDim = o.dimT != null && t >= o.dimT;
        return (
          <div key={i} style={{
            position: 'absolute', left: o.x - r, top: o.y - r + floatY,
            width: r * 2, height: r * 2, borderRadius: sk.name === 'cyber' ? 22 : 999,
            background: sk.mode === 'light' ? sw.bg : sk.surfaceAlt,
            border: `${isLit ? 4 : 2.5}px solid ${sw.rim}`,
            boxShadow: isLit ? `0 0 36px ${sw.glow}, ${sk.shadowSm}` : sk.shadowSm,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 18, boxSizing: 'border-box', textAlign: 'center',
            opacity: clamp(p * 3) * (isDim ? 0.36 : 1),
            transform: `scale(${pe * (isLit ? 1.09 : 1)})`,
          }}>
            <div style={{fontFamily: sk.fontTitle, fontSize: o.fs ?? (o.l.length > 4 ? 36 : 46), color: sk.ink, lineHeight: 1.15}}>{o.l}</div>
            {o.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sw.text, marginTop: 8, lineHeight: 1.2}}>{o.sub}</div>}
          </div>
        );
      })}
    </div>
  );
};

// ================================================================ 5. split_bars
export const SplitBars: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 940, h = e.h ?? 760, bars = (e.bars || []) as any[];
  const unit = e.unit ?? '¥';
  const maxV = e.maxV ?? Math.max(...bars.map((b: any) => (b.segs || []).reduce((s: number, g: any) => s + g.v, 0)), 1);
  const hasCallout = !!e.callout;
  const baseTop = hasCallout ? 210 : 138;
  const plotH = h - baseTop - 96;
  const barW = bars.length <= 2 ? 270 : 200;
  return (
    <div style={{
      width: w, height: h, position: 'relative', borderRadius: sk.radius,
      background: sk.surface,
      border: `2px solid ${sk.borderStrong}`,
      boxShadow: sk.shadow,
      padding: '28px 44px', boxSizing: 'border-box',
    }}>
      {e.title && <div style={{fontFamily: sk.fontTitle, fontSize: 44, color: sk.ink, textAlign: 'center', letterSpacing: 1}}>{e.title}</div>}
      {e.callout && prog(t, e.callout.t, 0.35) > 0 && (() => {
        const cp = back(prog(t, e.callout.t, 0.35));
        const ct = getSwatch(sk, e.callout.c || 'emerald');
        return (
          <div style={{
            position: 'absolute', left: '50%', top: 92, padding: '12px 30px', borderRadius: sk.radiusSm,
            background: ct.bg, border: `2px solid ${ct.rim}`,
            boxShadow: `${sk.shadowSm}, 0 0 24px ${ct.glow}`,
            transform: `translateX(-50%) scale(${cp})`, textAlign: 'center', whiteSpace: 'nowrap', zIndex: 5,
          }}>
            <span style={{fontFamily: sk.fontTitle, fontSize: 38, color: ct.text}}>{e.callout.l}</span>
            {e.callout.sub && <span style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkSub, marginLeft: 14}}>{e.callout.sub}</span>}
          </div>
        );
      })()}
      <div style={{position: 'absolute', left: 54, right: 54, top: baseTop + plotH, height: 2, background: sk.borderStrong}} />
      <div style={{
        position: 'absolute', left: 54, right: 54, top: baseTop, height: plotH,
        display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      }}>
        {bars.map((b: any, bi: number) => {
          const bp = eout(prog(t, b.t ?? e.t, 0.35));
          let sumCur = 0;
          const segs = (b.segs || []).map((s: any, si: number) => {
            const sp = eout(prog(t, s.t ?? b.t ?? e.t, 0.45));
            sumCur += s.v * sp;
            return {...s, sp, sh: Math.max(s.v > 0 ? 18 : 0, (s.v / maxV) * (plotH - 76)) * sp, sw: getSwatch(sk, s.c || PAL_ORDER[si % PAL_ORDER.length])};
          });
          const thinLabels = segs.filter((s: any) => s.sh > 1 && s.sh < 44);
          return (
            <div key={bi} style={{width: barW, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: bp, position: 'relative'}}>
              <div style={{fontFamily: sk.fontNum, fontSize: 60, color: sk.ink, marginBottom: 10, opacity: sumCur > 0.01 ? 1 : 0}}>
                {unit}{fmt(sumCur, e.dec ?? 2)}
              </div>
              {thinLabels.length > 0 && (
                <div style={{display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center'}}>
                  {thinLabels.map((s: any, ti: number) => (
                    <span key={ti} style={{
                      padding: '3px 10px', borderRadius: 8, background: s.sw.bg, border: `1px solid ${s.sw.rim}`,
                      fontFamily: sk.fontBody, fontSize: 19, color: s.sw.text, whiteSpace: 'nowrap',
                    }}>{s.l} +{unit}{fmt(s.v, e.dec ?? 2)}</span>
                  ))}
                </div>
              )}
              <div style={{width: barW, display: 'flex', flexDirection: 'column-reverse', borderRadius: sk.radiusSm, overflow: 'hidden', boxShadow: sk.shadowSm}}>
                {segs.map((s: any, si: number) => s.sh > 1 ? (
                  <div key={si} style={{
                    height: s.sh, width: '100%', background: s.sw.bar,
                    borderTop: '2px solid rgba(255,255,255,.22)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', padding: '0 10px', boxSizing: 'border-box',
                  }}>
                    {s.sh >= 44 && (
                      <div style={{fontFamily: sk.fontTitle, fontSize: s.sh >= 80 ? 32 : 24, color: '#ffffff', textShadow: '0 2px 6px rgba(0,0,0,.35)', whiteSpace: 'nowrap'}}>
                        {s.l} {s.valTxt || `${unit}${fmt(s.v, e.dec ?? 2)}`}
                      </div>
                    )}
                  </div>
                ) : null)}
              </div>
              <div style={{position: 'absolute', bottom: -68, textAlign: 'center', width: barW + 40}}>
                <div style={{fontFamily: sk.fontTitle, fontSize: 34, color: sk.ink}}>{b.l}</div>
                {b.sub && <div style={{fontFamily: sk.fontBody, fontSize: 20, color: sk.inkSub, marginTop: 2}}>{b.sub}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ================================================================ 6. phone_chart
export const PhoneChart: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 620, h = e.h ?? 980, mode = e.mode || 'bars', items = (e.items || []) as any[];
  const maxV = Math.max(...items.map((x: any) => x.v || 0), 1);
  const hiSw = getSwatch(sk, e.c || 'amber');
  return (
    <div style={{
      width: w, height: h, borderRadius: sk.name === 'cyber' ? 24 : 52, padding: '32px 30px 36px', boxSizing: 'border-box',
      background: sk.paperBg,
      border: `10px solid ${sk.name === 'cyber' ? sk.accent : '#1e2028'}`,
      boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      <div style={{width: 130, height: 22, borderRadius: 999, background: sk.name === 'cyber' ? sk.border : '#1e2028', margin: '0 auto 22px'}} />
      <div style={{textAlign: 'center', marginBottom: 18}}>
        <div style={{fontFamily: sk.fontTitle, fontSize: 40, color: sk.paperInk, lineHeight: 1.15}}>{e.title}</div>
        {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 21, color: sk.paperMuted, marginTop: 6}}>{e.sub}</div>}
      </div>
      {mode === 'bars' ? (
        <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '24px 8px 44px', borderBottom: `2px solid ${sk.divider}`, position: 'relative'}}>
          {items.map((it: any, i: number) => {
            const p = eout(prog(t, it.t ?? e.t, 0.45));
            const bh = Math.round(((it.v || 0) / maxV) * (h - 360) * p);
            const hi = !!it.hi;
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
                <div style={{fontFamily: sk.fontNum, fontSize: 32, color: hi ? hiSw.solid : sk.paperMuted, opacity: p}}>{it.valTxt ?? it.v}</div>
                <div style={{
                  width: Math.min(78, Math.floor((w - 130) / Math.max(1, items.length))),
                  height: Math.max(6, bh), borderRadius: '10px 10px 4px 4px',
                  background: hi ? hiSw.bar : 'linear-gradient(180deg,#cbd5e1,#94a3b8)',
                }} />
                <div style={{fontFamily: sk.fontBody, fontSize: 22, fontWeight: hi ? 800 : 600, color: hi ? sk.paperInk : sk.paperMuted, position: 'absolute', bottom: 8}}>{it.l}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center'}}>
          {items.map((it: any, i: number) => {
            const p = prog(t, it.t ?? e.t, 0.35);
            if (p <= 0) return null;
            const pe = eout(p);
            return (
              <div key={i} style={{
                padding: '18px 22px', borderRadius: sk.radiusSm,
                background: it.hi ? (sk.name === 'cyber' ? hiSw.bg : '#fff7e6') : (sk.name === 'cyber' ? sk.surfaceAlt : '#ffffff'),
                border: `2px solid ${it.hi ? hiSw.solid : sk.divider}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: pe, transform: `translateY(${(1 - pe) * 18}px)`,
              }}>
                <div style={{fontFamily: sk.fontTitle, fontSize: 32, color: sk.paperInk}}>{it.l}</div>
                {it.valTxt && <div style={{fontFamily: sk.fontNum, fontSize: 36, color: it.hi ? hiSw.solid : sk.paperMuted}}>{it.valTxt}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ================================================================ 7. ruler_track
export const RulerTrack: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 960, items = (e.items || []) as any[], n = items.length;
  let active = 0;
  for (let i = 1; i < n; i++) if (t >= (items[i].t ?? 1e9)) active = (i - 1) + eio(prog(t, items[i].t, 0.4));
  const padX = 80, spanW = w - padX * 2;
  const xOf = (idx: number) => padX + (n <= 1 ? spanW / 2 : (idx / (n - 1)) * spanW);
  const curX = xOf(active);
  const curIdx = Math.min(n - 1, Math.round(active));
  const curItem = items[curIdx] || items[0];
  const sw = getSwatch(sk, curItem?.c || 'amber');
  const tickCount = 36;
  return (
    <div style={{width: w, height: 320, position: 'relative'}}>
      {items.map((it: any, i: number) => {
        const p = eout(prog(t, it.t ?? e.t, 0.35));
        if (p <= 0) return null;
        const isCur = Math.abs(i - active) < 0.55;
        const itP = getSwatch(sk, it.c || PAL_ORDER[i % PAL_ORDER.length]);
        return (
          <div key={i} style={{
            position: 'absolute', left: xOf(i), top: isCur ? 14 : 36,
            transform: `translateX(-50%) scale(${isCur ? 1.05 : 0.9})`,
            padding: '12px 18px', borderRadius: sk.radiusSm, minWidth: 165, textAlign: 'center',
            background: isCur ? itP.bg : sk.surfaceAlt,
            border: `2px solid ${isCur ? itP.rim : sk.border}`,
            boxShadow: isCur ? `${sk.shadowSm}, 0 0 22px ${itP.glow}` : sk.shadowSm,
            opacity: p * (isCur ? 1 : 0.72),
          }}>
            <div style={{fontFamily: sk.fontTitle, fontSize: 30, color: sk.ink, whiteSpace: 'nowrap'}}>{it.l}</div>
            {it.sub && <div style={{fontFamily: sk.fontBody, fontSize: 19, color: itP.text, marginTop: 4, whiteSpace: 'nowrap'}}>{it.sub}</div>}
          </div>
        );
      })}
      <svg width={w} height={140} style={{position: 'absolute', left: 0, top: 175, overflow: 'visible'}}>
        <line x1={padX} y1={48} x2={w - padX} y2={48} stroke={sk.borderStrong} strokeWidth={3} />
        <line x1={padX} y1={48} x2={curX} y2={48} stroke={sw.solid} strokeWidth={5} strokeLinecap="round" />
        {Array.from({length: tickCount + 1}).map((_, k) => {
          const x = padX + (k / tickCount) * spanW;
          const big = k % 6 === 0;
          return <line key={k} x1={x} y1={48} x2={x} y2={48 + (big ? 22 : 11)} stroke={big ? sk.inkSub : sk.divider} strokeWidth={big ? 2.5 : 1.5} />;
        })}
        <circle cx={curX} cy={48} r={14} fill={sw.solid} stroke={sk.ink} strokeWidth={4} />
      </svg>
      {items.map((it: any, i: number) => (
        <div key={'t' + i} style={{
          position: 'absolute', left: xOf(i), top: 256, transform: 'translateX(-50%)',
          fontFamily: sk.fontNum, fontSize: 30,
          color: Math.abs(i - active) < 0.55 ? sw.text : sk.inkDim,
          whiteSpace: 'nowrap',
        }}>{it.tick}</div>
      ))}
    </div>
  );
};

// ================================================================ 8. hero_pillars
export const HeroPillars: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 920, h = e.h ?? 880, gap = e.gap ?? 34, items = (e.items || []) as any[];
  const colW = (w - gap * (items.length - 1)) / Math.max(1, items.length);
  return (
    <div style={{width: w, height: h, display: 'flex', gap, alignItems: 'stretch'}}>
      {items.map((it: any, i: number) => {
        const p = prog(t, it.t ?? e.t, 0.42);
        const pe = back(p);
        const sw = getSwatch(sk, it.c || PAL_ORDER[i % PAL_ORDER.length]);
        const isDim = it.dimT != null && t >= it.dimT;
        return (
          <div key={i} style={{
            width: colW, height: h, borderRadius: sk.radius, position: 'relative',
            background: sk.surface,
            border: `2.5px solid ${sw.rim}`,
            boxShadow: `${sk.shadow}, 0 0 28px ${sw.glow}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
            padding: '44px 26px 24px', boxSizing: 'border-box', overflow: 'hidden',
            opacity: clamp(p * 2.8) * (isDim ? 0.42 : 1),
            transform: `translateY(${(1 - pe) * 50}px) scale(${lerp(0.94, 1, pe)})`,
          }}>
            <div style={{position: 'absolute', top: -60, left: -40, right: -40, height: 220, background: `radial-gradient(ellipse, ${sw.glow} 0%, transparent 70%)`, pointerEvents: 'none'}} />
            <div style={{textAlign: 'center', zIndex: 2, width: '100%'}}>
              <div style={{
                fontFamily: sk.fontTitle, fontSize: it.vertical ? 102 : 52, color: sk.ink, lineHeight: 1.15,
                writingMode: it.vertical ? 'vertical-rl' : 'horizontal-tb',
                letterSpacing: it.vertical ? 12 : 2,
              }}>{it.l}</div>
              {it.sub && <div style={{fontFamily: sk.fontBody, fontSize: 24, color: sw.text, marginTop: 12}}>{it.sub}</div>}
              {it.val && <div style={{fontFamily: sk.fontNum, fontSize: 78, color: sw.text, marginTop: 18}}>{it.val}</div>}
              {it.pts && (
                <div style={{marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left', width: '100%'}}>
                  {it.pts.map((pt: string, pi: number) => (
                    <div key={pi} style={{
                      padding: '10px 16px', borderRadius: sk.radiusSm, background: sk.surfaceSoft,
                      borderLeft: `4px solid ${sw.solid}`, fontFamily: sk.fontBody, fontSize: 26, color: sk.ink,
                    }}>{pt}</div>
                  ))}
                </div>
              )}
            </div>
            {it.img && (
              <Img src={img(it.img)} style={{
                width: colW - 36, height: 250, objectFit: 'contain', zIndex: 2,
                filter: 'drop-shadow(0 14px 24px rgba(0,0,0,.45))',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const STORY_ELS: any = {
  chain_card: ChainCard,
  dossier_grid: DossierGrid,
  ledger_board: LedgerBoard,
  orb_ring: OrbRing,
  split_bars: SplitBars,
  phone_chart: PhoneChart,
  ruler_track: RulerTrack,
  hero_pillars: HeroPillars,
};

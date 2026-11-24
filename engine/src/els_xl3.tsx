// els_xl3.tsx (2026-11-24): Wave-3 Universal Storytelling Primitives (10 components, fully skin-aware).
// Dissected from Xiaolin, Vox, Johnny Harris & top global explainers to complete a 26-component universal toolkit:
//   1. map_route      - Real Natural Earth 1 world/region map (world110.json) + country highlight + animated shipping/flight arcs
//   2. chat_thread    - Multi-bubble negotiation/chat/email sequence popping progressively with highlight callouts
//   3. balance_scale  - Animated physical fulcrum/beam scale tilting as weights land on left vs right pans
//   4. trend_curve    - Smooth progressive SVG line/area chart + milestone callouts + optional alert zone
//   5. funnel_flow    - Multi-stage conversion/screening funnel with narrowing trapezoids & drop-off badges
//   6. network_web    - Hub-and-spoke / ecosystem relationship graph with animated glowing links & traveling dots
//   7. split_compare  - Before/After or A-vs-B split comparison (side_by_side / top_bottom / slider wipe)
//   8. gauge_meter    - Semi-circular risk/health/heat speedometer with sweeping needle + factor pills
//   9. tree_branch    - Decision tree / binary branching playbook growing branch-by-branch
//  10. screen_callout - Clean browser/app UI frame with animated zoom & spotlight rectangle dimming surroundings
import React from 'react';
import {Img} from 'remotion';
import {back, clamp, eio, eout, img, lerp, prog} from './lib';
import {getSkin, getSwatch, PAL_ORDER, resolveAccent} from './skin_tokens';
import WORLD from './geo/world110.json';

const Wd: any = WORLD;
const ne1 = (lon: number, lat: number): [number, number] => {
  const l = (lon * Math.PI) / 180, p = (lat * Math.PI) / 180, p2 = p * p, p4 = p2 * p2;
  const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)));
  const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + p2 * 0.028874 - 0.005916 * p4)));
  return [Wd.ox + x * Wd.S, Wd.oy - y * Wd.S];
};

const MAP_VIEWS: Record<string, [number, number, number, number]> = {
  world:    [0, 60, 2000, 760],
  pacific:  [150, 90, 1750, 560],
  us_eu:    [280, 95, 980, 390],
  eurasia:  [860, 80, 980, 480],
  asia:     [1220, 140, 620, 440],
  americas: [240, 100, 620, 680],
  europe:   [880, 85, 360, 240],
};

// ================================================================ 1. map_route
// props: title?, sub?, w(940), h(820), region?('world'|'eurasia'|'asia'|'europe'|'americas'|'us_eu'), viewBox?:[x,y,w,h],
//        hi?: [{id:'CHN', c?:'crimson', label?, t?}],
//        routes?: [{from:[lon,lat,label], to:[lon,lat,label], tag?, c?, bend?(-0.22), t?}],
//        footer?: string, skin?
export const MapRoute: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 940, h = e.h ?? 820;
  const t0 = e.t ?? 0;
  const vb: [number, number, number, number] = e.viewBox || MAP_VIEWS[e.region || 'eurasia'] || MAP_VIEWS.world;
  const [vx, vy, vw, vh] = vb;
  const hiMap: Record<string, any> = {};
  (e.hi || []).forEach((h0: any) => { hiMap[String(h0.id).toUpperCase()] = h0; });
  const routes: any[] = e.routes || [];
  const scaleFactor = vw / (w - 56);

  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, padding: '26px 28px', boxSizing: 'border-box',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden',
    }}>
      {e.title && (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 6px'}}>
          <div style={{fontFamily: sk.fontTitle, fontSize: 42, color: sk.ink, letterSpacing: 1}}>{e.title}</div>
          {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkSub}}>{e.sub}</div>}
        </div>
      )}

      <div style={{
        flex: 1, borderRadius: sk.radiusSm, overflow: 'hidden', position: 'relative',
        background: sk.map.ocean, border: `1.5px solid ${sk.border}`,
      }}>
        <svg width="100%" height="100%" viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet">
          {/* Subtle graticule lines */}
          {[200, 350, 500, 650].map((gy) => (
            <line key={'h' + gy} x1={0} y1={gy} x2={2000} y2={gy} stroke={sk.map.graticule} strokeWidth={1.2 * scaleFactor} strokeDasharray={`${6 * scaleFactor} ${6 * scaleFactor}`} />
          ))}
          {[400, 700, 1000, 1300, 1600].map((gx) => (
            <line key={'v' + gx} x1={gx} y1={0} x2={gx} y2={879} stroke={sk.map.graticule} strokeWidth={1.2 * scaleFactor} strokeDasharray={`${6 * scaleFactor} ${6 * scaleFactor}`} />
          ))}

          {/* Countries */}
          {Object.entries(Wd.c as Record<string, string>).map(([iso, d]) => {
            const hi = hiMap[iso];
            const hp = hi ? eout(prog(t, hi.t ?? t0, 0.45)) : 0;
            const sw = hi ? getSwatch(sk, hi.c || 'amber') : null;
            return (
              <path key={iso} d={d}
                fill={hi && hp > 0.01 ? sw!.solid : sk.map.land}
                fillOpacity={hi ? lerp(0.35, sk.mode === 'light' ? 0.85 : 0.78, hp) : 1}
                stroke={hi && hp > 0.01 ? sk.ink : sk.map.landStroke}
                strokeWidth={(hi ? 1.8 : 0.9) * scaleFactor}
              />
            );
          })}

          {/* Animated routes */}
          {routes.map((rt, ri) => {
            const rp = eio(prog(t, rt.t ?? (t0 + 0.25 + ri * 0.6), rt.d ?? 0.95));
            if (rp <= 0.01) return null;
            const [x1, y1] = ne1(rt.from[0], rt.from[1]);
            const [x2, y2] = ne1(rt.to[0], rt.to[1]);
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            const dist = Math.hypot(x2 - x1, y2 - y1);
            const bend = (rt.bend ?? -0.24) * dist;
            const cx = mx - ((y2 - y1) / Math.max(1, dist)) * bend;
            const cy = my + ((x2 - x1) / Math.max(1, dist)) * bend;
            const col = resolveAccent(sk, rt.c || PAL_ORDER[ri % PAL_ORDER.length]);
            // Quadratic Bezier point at rp
            const u = 1 - rp;
            const px = u * u * x1 + 2 * u * rp * cx + rp * rp * x2;
            const py = u * u * y1 + 2 * u * rp * cy + rp * rp * y2;
            const tx = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
            const ty = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
            const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
            const approxLen = dist * 1.35;
            const fontSz = 19 * scaleFactor;
            return (
              <g key={ri}>
                <path d={pathD} fill="none" stroke={col} strokeWidth={4.2 * scaleFactor} strokeLinecap="round"
                  strokeDasharray={`${approxLen}`} strokeDashoffset={approxLen * (1 - rp)} opacity={0.95} />
                {/* Origin pin */}
                <circle cx={x1} cy={y1} r={7.5 * scaleFactor} fill={col} stroke={sk.ink} strokeWidth={2.5 * scaleFactor} />
                {rt.from[2] && (
                  <text x={x1} y={y1 + 26 * scaleFactor} textAnchor="middle" fill={sk.ink}
                    fontFamily={sk.fontBody} fontWeight={900} fontSize={fontSz}
                    stroke={sk.map.ocean} strokeWidth={4 * scaleFactor} paintOrder="stroke">{rt.from[2]}</text>
                )}
                {/* Moving head pulse */}
                <circle cx={px} cy={py} r={14 * scaleFactor} fill={col} opacity={0.28} />
                <circle cx={px} cy={py} r={7.5 * scaleFactor} fill={sk.mode === 'light' ? '#fff' : '#fff'} stroke={col} strokeWidth={3.5 * scaleFactor} />
                {/* Destination label */}
                {rp > 0.75 && rt.to[2] && (
                  <text x={x2} y={y2 - 16 * scaleFactor} textAnchor="middle" fill={sk.ink}
                    fontFamily={sk.fontBody} fontWeight={900} fontSize={fontSz}
                    stroke={sk.map.ocean} strokeWidth={4 * scaleFactor} paintOrder="stroke"
                    opacity={clamp((rp - 0.75) * 4)}>{rt.to[2]}</text>
                )}
                {/* Route midpoint tag */}
                {rt.tag && rp > 0.5 && (
                  <g opacity={clamp((rp - 0.5) * 3)}>
                    <rect x={tx - 78 * scaleFactor} y={ty - 19 * scaleFactor} width={156 * scaleFactor} height={32 * scaleFactor}
                      rx={8 * scaleFactor} fill={col} />
                    <text x={tx} y={ty + 5 * scaleFactor} textAnchor="middle" fill={getSwatch(sk, rt.c || PAL_ORDER[ri % PAL_ORDER.length]).onSolid}
                      fontFamily={sk.fontBody} fontWeight={900} fontSize={16 * scaleFactor}>{rt.tag}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom legend / takeaway pills */}
      {(e.hi?.length > 0 || e.footer) && (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap', padding: '0 4px'}}>
          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
            {(e.hi || []).filter((x: any) => x.label).map((x: any, i: number) => {
              const sw = getSwatch(sk, x.c || 'amber');
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px',
                  borderRadius: 999, background: sk.surfaceSoft, border: `1.5px solid ${sw.rim}`,
                }}>
                  <span style={{width: 12, height: 12, borderRadius: 999, background: sw.solid}} />
                  <span style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 22, color: sk.ink}}>{x.label}</span>
                </div>
              );
            })}
          </div>
          {e.footer && <div style={{fontFamily: sk.fontTitle, fontSize: 28, color: sk.accent}}>{e.footer}</div>}
        </div>
      )}
    </div>
  );
};

// ================================================================ 2. chat_thread
// props: title?, sub?, w(880), h(880), items: [{side:'left'|'right', name, text, tag?, c?, hi?, t}], takeaway?:{text, c?, t}, skin?
export const ChatThread: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 880, h = e.h ?? 880;
  const items: any[] = e.items || [];
  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, padding: '26px 32px', boxSizing: 'border-box',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden',
    }}>
      {/* Top header bar */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: `1.5px solid ${sk.divider}`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 14, height: 14, borderRadius: 999, background: sk.pal.emerald.solid}} />
          <div style={{fontFamily: sk.fontTitle, fontSize: 38, color: sk.ink}}>{e.title || '真实对话还原'}</div>
        </div>
        {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 21, color: sk.inkDim}}>{e.sub}</div>}
      </div>

      {/* Messages */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20}}>
        {items.map((m, i) => {
          const p = prog(t, m.t ?? (e.t ?? 0) + i * 0.65, 0.36);
          if (p <= 0) return <div key={i} style={{minHeight: 84, opacity: 0}} />;
          const pe = back(p);
          const isR = m.side === 'right';
          const sw = getSwatch(sk, m.c || (isR ? 'teal' : 'royal'));
          const bubbleBg = m.hi ? sw.bg : isR ? sw.bg : sk.surfaceAlt;
          const borderCol = m.hi ? sw.rim : isR ? sw.rim : sk.border;
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: isR ? 'flex-end' : 'flex-start',
              opacity: clamp(p * 2.5), transform: `translateY(${(1 - pe) * 24}px) scale(${lerp(0.94, 1, pe)})`,
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexDirection: isR ? 'row-reverse' : 'row'}}>
                <div style={{
                  width: 34, height: 34, borderRadius: 999, background: sw.solid, color: sw.onSolid,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: sk.fontBody, fontWeight: 900, fontSize: 18,
                }}>{(m.name || 'A').slice(0, 1)}</div>
                <span style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 21, color: sk.inkSub}}>{m.name}</span>
                {m.tag && (
                  <span style={{
                    padding: '3px 12px', borderRadius: 999, background: sw.solid, color: sw.onSolid,
                    fontFamily: sk.fontBody, fontWeight: 900, fontSize: 17,
                  }}>{m.tag}</span>
                )}
              </div>
              <div style={{
                maxWidth: '84%', padding: '18px 24px',
                borderRadius: isR ? `${sk.radiusSm}px 4px ${sk.radiusSm}px ${sk.radiusSm}px` : `4px ${sk.radiusSm}px ${sk.radiusSm}px ${sk.radiusSm}px`,
                background: bubbleBg, border: `${m.hi ? 2.5 : 1.5}px solid ${borderCol}`,
                boxShadow: m.hi ? `0 10px 28px ${sw.glow}` : sk.shadowSm,
                fontFamily: sk.fontBody, fontWeight: m.hi ? 800 : 600, fontSize: 28, lineHeight: 1.38,
                color: sk.ink,
              }}>{m.text}</div>
            </div>
          );
        })}
      </div>

      {/* Bottom takeaway */}
      {e.takeaway && prog(t, e.takeaway.t ?? 0, 0.35) > 0 && (() => {
        const tp = back(prog(t, e.takeaway.t ?? 0, 0.35));
        const sw = getSwatch(sk, e.takeaway.c || 'crimson');
        return (
          <div style={{
            padding: '14px 22px', borderRadius: sk.radiusSm, background: sw.bg, border: `2px solid ${sw.rim}`,
            textAlign: 'center', fontFamily: sk.fontTitle, fontSize: 32, color: sw.text,
            transform: `scale(${lerp(0.92, 1, tp)})`, opacity: clamp(tp * 2),
          }}>{e.takeaway.text}</div>
        );
      })()}
    </div>
  );
};

// ================================================================ 3. balance_scale
// props: title?, w(920), h(820),
//        left: {label, val, sub?, weight?(1..10), c?}, right: {label, val, sub?, weight?(1..10), c?},
//        tipAt?, verdict?: {text, c?, t}, skin?
export const BalanceScale: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 920, h = e.h ?? 820;
  const L = e.left || {label: 'A', val: '10', weight: 3}, R = e.right || {label: 'B', val: '90', weight: 8};
  const swL = getSwatch(sk, L.c || 'royal'), swR = getSwatch(sk, R.c || 'crimson');
  const t0 = e.t ?? 0;
  const tipP = eio(prog(t, e.tipAt ?? t0 + 0.55, 0.85));
  const diff = clamp(((R.weight ?? 6) - (L.weight ?? 4)) / 10, -1, 1);
  const angle = diff * 14 * tipP; // degrees, positive = right side heavier/lower
  const rad = (angle * Math.PI) / 180;
  const beamHalf = 270;
  const dy = Math.sin(rad) * beamHalf;

  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, padding: '28px 34px', boxSizing: 'border-box',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative',
    }}>
      {e.title && (
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: sk.fontTitle, fontSize: 44, color: sk.ink}}>{e.title}</div>
          {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkSub, marginTop: 4}}>{e.sub}</div>}
        </div>
      )}

      {/* Scale stage */}
      <div style={{width: w - 68, height: 500, position: 'relative'}}>
        <svg width={w - 68} height={500} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {/* Fulcrum stand */}
          <polygon points={`${(w - 68) / 2},270 ${(w - 68) / 2 - 42},465 ${(w - 68) / 2 + 42},465`}
            fill={sk.surfaceMuted} stroke={sk.borderStrong} strokeWidth={3} />
          <rect x={(w - 68) / 2 - 120} y={462} width={240} height={16} rx={8} fill={sk.borderStrong} />
          {/* Tilting beam */}
          <g transform={`rotate(${angle}, ${(w - 68) / 2}, 270)`}>
            <line x1={(w - 68) / 2 - beamHalf} y1={270} x2={(w - 68) / 2 + beamHalf} y2={270}
              stroke={sk.ink} strokeWidth={10} strokeLinecap="round" />
            <circle cx={(w - 68) / 2 - beamHalf} cy={270} r={10} fill={swL.solid} />
            <circle cx={(w - 68) / 2 + beamHalf} cy={270} r={10} fill={swR.solid} />
          </g>
          {/* Pivot cap */}
          <circle cx={(w - 68) / 2} cy={270} r={18} fill={sk.accent} stroke={sk.ink} strokeWidth={4} />
        </svg>

        {/* Left pan card */}
        <div style={{
          position: 'absolute', left: (w - 68) / 2 - beamHalf - 165, top: 270 - dy - 210,
          width: 330, padding: '22px 20px', boxSizing: 'border-box', borderRadius: sk.radiusSm,
          background: swL.bg, border: `2.5px solid ${swL.rim}`, boxShadow: sk.shadowSm, textAlign: 'center',
        }}>
          <div style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 24, color: sk.inkSub}}>{L.label}</div>
          <div style={{fontFamily: sk.fontNum, fontSize: 74, color: swL.text, lineHeight: 1.05, marginTop: 4}}>{L.val}</div>
          {L.sub && <div style={{fontFamily: sk.fontBody, fontSize: 21, color: sk.inkSub, marginTop: 6}}>{L.sub}</div>}
        </div>

        {/* Right pan card */}
        <div style={{
          position: 'absolute', left: (w - 68) / 2 + beamHalf - 165, top: 270 + dy - 210,
          width: 330, padding: '22px 20px', boxSizing: 'border-box', borderRadius: sk.radiusSm,
          background: swR.bg, border: `2.5px solid ${swR.rim}`, boxShadow: sk.shadowSm, textAlign: 'center',
        }}>
          <div style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 24, color: sk.inkSub}}>{R.label}</div>
          <div style={{fontFamily: sk.fontNum, fontSize: 74, color: swR.text, lineHeight: 1.05, marginTop: 4}}>{R.val}</div>
          {R.sub && <div style={{fontFamily: sk.fontBody, fontSize: 21, color: sk.inkSub, marginTop: 6}}>{R.sub}</div>}
        </div>
      </div>

      {/* Verdict banner */}
      {e.verdict && prog(t, e.verdict.t ?? t0 + 1.0, 0.35) > 0 && (() => {
        const vp = back(prog(t, e.verdict.t ?? t0 + 1.0, 0.35));
        const sw = getSwatch(sk, e.verdict.c || 'amber');
        return (
          <div style={{
            padding: '14px 32px', borderRadius: 999, background: sw.solid, color: sw.onSolid,
            fontFamily: sk.fontTitle, fontSize: 34, boxShadow: sk.shadowSm,
            transform: `scale(${lerp(0.85, 1, vp)})`, opacity: clamp(vp * 2),
          }}>{e.verdict.text}</div>
        );
      })()}
    </div>
  );
};

// ================================================================ 4. trend_curve
// props: title?, sub?, w(920), h(800), xLabels: string[], yUnit?, minY?, maxY?,
//        series: [{label, c?, points: number[], area?: boolean}],
//        callouts?: [{seriesIdx?, idx, label, val?, c?, t}], skin?
export const TrendCurve: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 920, h = e.h ?? 800;
  const t0 = e.t ?? 0;
  const xLabels: string[] = e.xLabels || [];
  const series: any[] = e.series || [];
  const allPts = series.flatMap((s) => s.points || []);
  const minY = e.minY ?? Math.min(0, ...allPts);
  const maxY = e.maxY ?? Math.max(1, ...allPts) * 1.15;
  const drawP = eio(prog(t, t0 + 0.15, e.drawDur ?? 1.35));

  const svgW = w - 64, svgH = h - 220;
  const padL = 78, padR = 44, padT = 68, padB = 56;
  const plotW = svgW - padL - padR, plotH = svgH - padT - padB;
  const n = Math.max(2, xLabels.length || (series[0]?.points?.length ?? 2));
  const xOf = (i: number) => padL + (i / (n - 1)) * plotW;
  const yOf = (v: number) => padT + plotH - ((v - minY) / Math.max(1e-6, maxY - minY)) * plotH;

  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, padding: '28px 32px', boxSizing: 'border-box',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
        <div>
          {e.title && <div style={{fontFamily: sk.fontTitle, fontSize: 42, color: sk.ink}}>{e.title}</div>}
          {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 21, color: sk.inkSub, marginTop: 2}}>{e.sub}</div>}
        </div>
        <div style={{display: 'flex', gap: 14}}>
          {series.map((s, si) => {
            const col = resolveAccent(sk, s.c || PAL_ORDER[si % PAL_ORDER.length]);
            return (
              <div key={si} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: sk.surfaceSoft}}>
                <span style={{width: 14, height: 4, borderRadius: 2, background: col}} />
                <span style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 20, color: sk.ink}}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <svg width={svgW} height={svgH} style={{overflow: 'visible'}}>
        <defs>
          <clipPath id={`tc_clip_${sk.name}`}>
            <rect x={padL - 10} y={0} width={(plotW + 24) * drawP} height={svgH} />
          </clipPath>
          {series.map((s, si) => {
            const col = resolveAccent(sk, s.c || PAL_ORDER[si % PAL_ORDER.length]);
            return (
              <linearGradient key={si} id={`tc_grad_${sk.name}_${si}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={col} stopOpacity={sk.mode === 'light' ? 0.24 : 0.34} />
                <stop offset="100%" stopColor={col} stopOpacity={0.0} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, gi) => {
          const v = lerp(minY, maxY, f), y = yOf(v);
          return (
            <g key={gi}>
              <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke={sk.divider} strokeWidth={1.5} strokeDasharray={gi === 0 ? undefined : '6 6'} />
              <text x={padL - 12} y={y + 7} textAnchor="end" fill={sk.inkDim} fontFamily={sk.fontNum} fontSize={22}>
                {Math.round(v)}{e.yUnit || ''}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {xLabels.map((xl, i) => (
          <text key={i} x={xOf(i)} y={padT + plotH + 34} textAnchor="middle" fill={sk.inkSub} fontFamily={sk.fontBody} fontWeight={700} fontSize={21}>{xl}</text>
        ))}

        {/* Lines & areas clipped to drawP */}
        <g clipPath={`url(#tc_clip_${sk.name})`}>
          {series.map((s, si) => {
            const pts: number[] = s.points || [];
            const col = resolveAccent(sk, s.c || PAL_ORDER[si % PAL_ORDER.length]);
            const coords = pts.map((v, i) => [xOf(i), yOf(v)]);
            const d = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
            const areaD = `${d} L ${coords[coords.length - 1][0].toFixed(1)} ${(padT + plotH).toFixed(1)} L ${coords[0][0].toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;
            return (
              <g key={si}>
                {s.area !== false && <path d={areaD} fill={`url(#tc_grad_${sk.name}_${si})`} />}
                <path d={d} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
                {coords.map(([x, y], pi) => (
                  <circle key={pi} cx={x} cy={y} r={7} fill={sk.mode === 'light' ? '#fff' : '#0b101b'} stroke={col} strokeWidth={4} />
                ))}
              </g>
            );
          })}
        </g>

        {/* Callout pins */}
        {(e.callouts || []).map((c: any, ci: number) => {
          const cp = back(prog(t, c.t ?? t0 + 0.9 + ci * 0.4, 0.35));
          if (cp <= 0.01) return null;
          const s = series[c.seriesIdx ?? 0] || series[0];
          const v = s.points[c.idx] ?? 0;
          const x = xOf(c.idx), y = yOf(v);
          const sw = getSwatch(sk, c.c || s.c || 'crimson');
          const boxW = Math.max(150, (c.label.length + (c.val?.length || 0)) * 22 + 34);
          const bx = clamp(x - boxW / 2, padL, svgW - boxW - 8);
          const by = Math.max(6, y - 82);
          return (
            <g key={ci} opacity={clamp(cp * 2)} transform={`translate(0, ${(1 - cp) * 14})`}>
              <line x1={x} y1={y - 10} x2={x} y2={by + 54} stroke={sw.solid} strokeWidth={2.5} strokeDasharray="4 4" />
              <circle cx={x} cy={y} r={11} fill={sw.solid} stroke={sk.ink} strokeWidth={3} />
              <rect x={bx} y={by} width={boxW} height={54} rx={12} fill={sw.solid} />
              <text x={bx + boxW / 2} y={by + 35} textAnchor="middle" fill={sw.onSolid} fontFamily={sk.fontBody} fontWeight={900} fontSize={23}>
                {c.label}{c.val ? ` ${c.val}` : ''}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ================================================================ 5. funnel_flow
// props: title?, sub?, w(920), h(840), stages: [{label, val, pct?, note?, c?, t}], skin?
export const FunnelFlow: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 920, h = e.h ?? 840;
  const stages: any[] = e.stages || [];
  const n = Math.max(1, stages.length);
  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, padding: '28px 34px', boxSizing: 'border-box',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      {e.title && (
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: sk.fontTitle, fontSize: 44, color: sk.ink}}>{e.title}</div>
          {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkSub, marginTop: 4}}>{e.sub}</div>}
        </div>
      )}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, alignItems: 'center'}}>
        {stages.map((st, i) => {
          const p = prog(t, st.t ?? (e.t ?? 0) + i * 0.45, 0.38);
          const pe = back(p);
          const sw = getSwatch(sk, st.c || PAL_ORDER[i % PAL_ORDER.length]);
          const pctW = lerp(100, 62, n <= 1 ? 0 : i / (n - 1));
          const barW = Math.round(((w - 92) * pctW) / 100);
          const rowH = Math.min(130, Math.floor((h - 210) / n) - 12);
          return (
            <div key={i} style={{
              width: barW, height: rowH, borderRadius: sk.radiusSm,
              background: sw.bg, border: `2px solid ${sw.rim}`, boxShadow: sk.shadowSm,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '0 26px', boxSizing: 'border-box',
              opacity: clamp(p * 2.5), transform: `scaleX(${lerp(0.82, 1, pe)}) translateY(${(1 - pe) * 18}px)`,
              position: 'relative',
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, minWidth: 0}}>
                <span style={{
                  width: 36, height: 36, borderRadius: 999, background: sw.solid, color: sw.onSolid,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: sk.fontNum, fontSize: 24, flexShrink: 0,
                }}>{i + 1}</span>
                <div style={{minWidth: 0}}>
                  <div style={{fontFamily: sk.fontTitle, fontSize: 32, color: sk.ink, lineHeight: 1.1, whiteSpace: 'nowrap'}}>{st.label}</div>
                  {st.note && <div style={{fontFamily: sk.fontBody, fontSize: 19, color: sk.inkSub, marginTop: 3, whiteSpace: 'nowrap'}}>{st.note}</div>}
                </div>
              </div>
              <div style={{textAlign: 'right', flexShrink: 0}}>
                <div style={{fontFamily: sk.fontNum, fontSize: 44, color: sw.text, lineHeight: 1, whiteSpace: 'nowrap'}}>{st.val}</div>
                {st.pct && <div style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 19, color: sk.inkDim}}>{st.pct}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ================================================================ 6. network_web
// props: title?, w(920), h(820),
//        nodes: [{id, label, sub?, x(0..1), y(0..1), r?(72), c?, hero?, t?}],
//        edges: [{from, to, label?, dashed?, c?, t?}], skin?
export const NetworkWeb: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 920, h = e.h ?? 820;
  const t0 = e.t ?? 0;
  const nodes: any[] = e.nodes || [];
  const edges: any[] = e.edges || [];
  const padX = 40, padT = e.title ? 105 : 32, padB = 34;
  const stageW = w - padX * 2, stageH = h - padT - padB;
  const nodeById: Record<string, any> = {};
  nodes.forEach((nd) => {
    nodeById[nd.id] = {...nd, px: padX + nd.x * stageW, py: padT + nd.y * stageH};
  });

  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, position: 'relative',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow, overflow: 'hidden',
    }}>
      {e.title && (
        <div style={{position: 'absolute', top: 26, left: 0, right: 0, textAlign: 'center', fontFamily: sk.fontTitle, fontSize: 44, color: sk.ink}}>
          {e.title}
        </div>
      )}

      {/* Edges SVG */}
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        {edges.map((ed, ei) => {
          const a = nodeById[ed.from], b = nodeById[ed.to];
          if (!a || !b) return null;
          const ep = eout(prog(t, ed.t ?? t0 + 0.35 + ei * 0.25, 0.5));
          if (ep <= 0.01) return null;
          const col = resolveAccent(sk, ed.c || a.c || 'teal');
          const ex = lerp(a.px, b.px, ep), ey = lerp(a.py, b.py, ep);
          const mx = (a.px + b.px) / 2, my = (a.py + b.py) / 2;
          const pulse = ((t * 0.6 + ei * 0.27) % 1);
          const dx = lerp(a.px, b.px, pulse), dy = lerp(a.py, b.py, pulse);
          return (
            <g key={ei}>
              <line x1={a.px} y1={a.py} x2={ex} y2={ey} stroke={col} strokeWidth={4}
                strokeDasharray={ed.dashed ? '10 8' : undefined} opacity={0.85} />
              {ep >= 0.99 && <circle cx={dx} cy={dy} r={6.5} fill={col} />}
              {ed.label && ep > 0.65 && (
                <g opacity={clamp((ep - 0.65) * 3)}>
                  <rect x={mx - 62} y={my - 17} width={124} height={34} rx={10} fill={sk.mode === 'light' ? '#fffdf8' : '#0f1624'} stroke={col} strokeWidth={1.8} />
                  <text x={mx} y={my + 7} textAnchor="middle" fill={sk.ink} fontFamily={sk.fontBody} fontWeight={800} fontSize={19}>{ed.label}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((nd, ni) => {
        const p = prog(t, nd.t ?? t0 + ni * 0.22, 0.38);
        if (p <= 0) return null;
        const pe = back(p);
        const pos = nodeById[nd.id];
        const sw = getSwatch(sk, nd.c || PAL_ORDER[ni % PAL_ORDER.length]);
        const r = nd.r ?? (nd.hero ? 94 : 84);
        return (
          <div key={nd.id} style={{
            position: 'absolute', left: pos.px - r, top: pos.py - r, width: r * 2, height: r * 2,
            borderRadius: sk.name === 'cyber' ? 16 : 999,
            background: nd.hero ? sw.bar : sw.bg,
            border: `${nd.hero ? 4 : 2.5}px solid ${sw.rim}`,
            boxShadow: nd.hero ? `0 18px 44px ${sw.glow}, ${sk.shadowSm}` : sk.shadowSm,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 10, boxSizing: 'border-box', textAlign: 'center',
            opacity: clamp(p * 2.5), transform: `scale(${pe})`,
          }}>
            <div style={{
              fontFamily: sk.fontTitle, fontSize: nd.hero ? 36 : (nd.label.length >= 5 ? 24 : 28),
              color: nd.hero ? '#ffffff' : sk.ink, lineHeight: 1.15, whiteSpace: 'nowrap',
            }}>{nd.label}</div>
            {nd.sub && (
              <div style={{
                fontFamily: sk.fontBody, fontWeight: 700, fontSize: 18,
                color: nd.hero ? 'rgba(255,255,255,.88)' : sw.text, marginTop: 4,
              }}>{nd.sub}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ================================================================ 7. split_compare
// props: title?, w(920), h(840), mode?('side_by_side'|'top_bottom'),
//        left: {badge, label, src?, bullets?:string[], c?, t?}, right: {badge, label, src?, bullets?:string[], c?, t?}, skin?
export const SplitCompare: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 920, h = e.h ?? 840;
  const L = e.left || {}, R = e.right || {};
  const t0 = e.t ?? 0;
  const pL = back(prog(t, L.t ?? t0, 0.42)), pR = back(prog(t, R.t ?? t0 + 0.45, 0.42));
  const swL = getSwatch(sk, L.c || 'slate'), swR = getSwatch(sk, R.c || 'teal');
  const vert = e.mode === 'top_bottom';

  return (
    <div style={{
      width: w, height: h, display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {e.title && <div style={{fontFamily: sk.fontTitle, fontSize: 44, color: sk.ink, textAlign: 'center'}}>{e.title}</div>}
      <div style={{flex: 1, display: 'flex', flexDirection: vert ? 'column' : 'row', gap: 18}}>
        {[{d: L, p: pL, sw: swL}, {d: R, p: pR, sw: swR}].map(({d, p, sw}, idx) => (
          <div key={idx} style={{
            flex: 1, borderRadius: sk.radius, overflow: 'hidden',
            background: sk.surface, border: `2.5px solid ${sw.rim}`, boxShadow: sk.shadow,
            display: 'flex', flexDirection: 'column',
            opacity: clamp(p * 2.2), transform: `translateY(${(1 - p) * 24}px)`,
          }}>
            {d.src && (
              <div style={{height: vert ? 185 : 330, position: 'relative', overflow: 'hidden'}}>
                <Img src={img(d.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,.55) 100%)'}} />
              </div>
            )}
            <div style={{flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 12}}>
              {d.badge && (
                <div style={{
                  alignSelf: 'flex-start', padding: '5px 16px', borderRadius: 999,
                  background: sw.solid, color: sw.onSolid, fontFamily: sk.fontBody, fontWeight: 900, fontSize: 21,
                }}>{d.badge}</div>
              )}
              <div style={{fontFamily: sk.fontTitle, fontSize: 38, color: sk.ink, lineHeight: 1.15}}>{d.label}</div>
              {(d.bullets || []).map((b: string, bi: number) => (
                <div key={bi} style={{
                  padding: '10px 14px', borderRadius: sk.radiusSm, background: sk.surfaceSoft,
                  borderLeft: `4px solid ${sw.solid}`, fontFamily: sk.fontBody, fontWeight: 700, fontSize: 23, color: sk.inkSub,
                }}>{b}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================================================================ 8. gauge_meter
// props: title?, sub?, w(880), h(800), value(0..100), big?, status?, c?, needleAt?,
//        zones?: [{to:number, c:string}], factors?: [{label, val, c?, t?}], skin?
export const GaugeMeter: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 880, h = e.h ?? 800;
  const t0 = e.t ?? 0;
  const val = clamp(e.value ?? 72, 0, 100);
  const np = eio(prog(t, e.needleAt ?? t0 + 0.2, 1.05));
  const curVal = val * np;
  const deg = -90 + (curVal / 100) * 180;
  const zones = e.zones || [{to: 35, c: 'emerald'}, {to: 70, c: 'amber'}, {to: 100, c: 'crimson'}];
  const swMain = getSwatch(sk, e.c || (val >= 70 ? 'crimson' : val >= 40 ? 'amber' : 'emerald'));

  const cx = 360, cy = 310, r = 240;
  const arcPath = (a0: number, a1: number) => {
    const r0 = ((a0 - 180) * Math.PI) / 180, r1 = ((a1 - 180) * Math.PI) / 180;
    const x0 = cx + r * Math.cos(r0), y0 = cy + r * Math.sin(r0);
    const x1 = cx + r * Math.cos(r1), y1 = cy + r * Math.sin(r1);
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };

  let prev = 0;
  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, padding: '28px 34px', boxSizing: 'border-box',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {e.title && (
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: sk.fontTitle, fontSize: 44, color: sk.ink}}>{e.title}</div>
          {e.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkSub, marginTop: 4}}>{e.sub}</div>}
        </div>
      )}

      <div style={{position: 'relative', width: 720, height: 390}}>
        <svg width={720} height={390} style={{overflow: 'visible'}}>
          <path d={arcPath(0, 180)} fill="none" stroke={sk.surfaceMuted} strokeWidth={38} strokeLinecap="round" />
          {zones.map((z: any, zi: number) => {
            const a0 = (prev / 100) * 180, a1 = (z.to / 100) * 180;
            prev = z.to;
            return <path key={zi} d={arcPath(a0 + 1.5, a1 - 1.5)} fill="none" stroke={resolveAccent(sk, z.c)} strokeWidth={34} strokeLinecap="butt" opacity={0.92} />;
          })}
          {/* Needle */}
          <g transform={`rotate(${deg}, ${cx}, ${cy})`}>
            <polygon points={`${cx - 10},${cy} ${cx + 10},${cy} ${cx},${cy - r + 28}`} fill={sk.ink} />
            <circle cx={cx} cy={cy} r={22} fill={swMain.solid} stroke={sk.ink} strokeWidth={5} />
          </g>
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 2, textAlign: 'center'}}>
          <span style={{fontFamily: sk.fontNum, fontSize: 82, color: swMain.text, lineHeight: 1}}>{e.big || `${Math.round(curVal)}%`}</span>
          {e.status && (
            <span style={{
              marginLeft: 16, padding: '6px 18px', borderRadius: 999, background: swMain.solid, color: swMain.onSolid,
              fontFamily: sk.fontBody, fontWeight: 900, fontSize: 24, verticalAlign: 'middle',
            }}>{e.status}</span>
          )}
        </div>
      </div>

      {/* Bottom contributing factors */}
      {e.factors?.length > 0 && (
        <div style={{width: '100%', display: 'flex', gap: 14, justifyContent: 'center'}}>
          {e.factors.map((f: any, fi: number) => {
            const fp = back(prog(t, f.t ?? t0 + 0.75 + fi * 0.3, 0.35));
            const sw = getSwatch(sk, f.c || PAL_ORDER[fi % PAL_ORDER.length]);
            return (
              <div key={fi} style={{
                flex: 1, padding: '14px 16px', borderRadius: sk.radiusSm, background: sw.bg,
                border: `1.5px solid ${sw.rim}`, textAlign: 'center',
                opacity: clamp(fp * 2), transform: `translateY(${(1 - fp) * 18}px)`,
              }}>
                <div style={{fontFamily: sk.fontBody, fontSize: 20, color: sk.inkSub}}>{f.label}</div>
                <div style={{fontFamily: sk.fontTitle, fontSize: 30, color: sw.text, marginTop: 4}}>{f.val}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ================================================================ 9. tree_branch
// props: title?, w(920), h(840), root: {label, sub?},
//        branches: [{cond, label, result, note?, c?, t?}], skin?
export const TreeBranch: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 920, h = e.h ?? 840;
  const t0 = e.t ?? 0;
  const root = e.root || {label: '核心决策'};
  const branches: any[] = e.branches || [];
  const n = Math.max(1, branches.length);
  const colW = (w - 84 - (n - 1) * 18) / n;

  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, padding: '28px 32px', boxSizing: 'border-box',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
    }}>
      {e.title && <div style={{fontFamily: sk.fontTitle, fontSize: 40, color: sk.inkDim, marginBottom: 12}}>{e.title}</div>}

      {/* Root box */}
      <div style={{
        padding: '20px 44px', borderRadius: sk.radiusSm, background: sk.surfaceAlt,
        border: `2.5px solid ${sk.accent}`, boxShadow: sk.shadowSm, textAlign: 'center', zIndex: 2,
      }}>
        <div style={{fontFamily: sk.fontTitle, fontSize: 40, color: sk.ink}}>{root.label}</div>
        {root.sub && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkSub, marginTop: 4}}>{root.sub}</div>}
      </div>

      {/* Connector lines */}
      <svg width={w - 64} height={96} style={{overflow: 'visible'}}>
        {branches.map((br, i) => {
          const bp = eout(prog(t, br.t ?? t0 + 0.35 + i * 0.45, 0.4));
          const sw = getSwatch(sk, br.c || PAL_ORDER[i % PAL_ORDER.length]);
          const sx = (w - 64) / 2;
          const ex = i * (colW + 18) + colW / 2 + 10;
          return (
            <path key={i} d={`M ${sx} 0 C ${sx} 52, ${ex} 42, ${ex} 96`}
              fill="none" stroke={sw.solid} strokeWidth={4} opacity={bp} strokeLinecap="round" />
          );
        })}
      </svg>

      {/* Branches */}
      <div style={{width: '100%', flex: 1, display: 'flex', gap: 18, alignItems: 'stretch'}}>
        {branches.map((br, i) => {
          const bp = back(prog(t, br.t ?? t0 + 0.4 + i * 0.45, 0.42));
          const sw = getSwatch(sk, br.c || PAL_ORDER[i % PAL_ORDER.length]);
          return (
            <div key={i} style={{
              flex: 1, borderRadius: sk.radiusSm, background: sw.bg, border: `2px solid ${sw.rim}`,
              padding: '22px 20px', boxSizing: 'border-box', boxShadow: sk.shadowSm,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center',
              opacity: clamp(bp * 2.2), transform: `translateY(${(1 - bp) * 26}px)`,
            }}>
              <div style={{
                padding: '6px 16px', borderRadius: 999, background: sw.solid, color: sw.onSolid,
                fontFamily: sk.fontBody, fontWeight: 900, fontSize: 21,
              }}>{br.cond}</div>
              <div>
                <div style={{fontFamily: sk.fontTitle, fontSize: 38, color: sk.ink, lineHeight: 1.15}}>{br.label}</div>
                {br.note && <div style={{fontFamily: sk.fontBody, fontSize: 22, color: sk.inkSub, marginTop: 10, lineHeight: 1.35}}>{br.note}</div>}
              </div>
              <div style={{
                width: '100%', padding: '12px 14px', borderRadius: sk.radiusSm,
                background: sk.surfaceSoft, borderTop: `2px solid ${sw.rim}`,
                fontFamily: sk.fontTitle, fontSize: 28, color: sw.text,
              }}>{br.result}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ================================================================ 10. screen_callout
// props: title?, url?, src, w(920), h(820),
//        focus?: [{x(0..1), y(0..1), w(0..1), h(0..1), label, note?, c?, t?}], skin?
export const ScreenCallout: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 920, h = e.h ?? 820;
  const t0 = e.t ?? 0;
  const focuses: any[] = e.focus || [];
  let activeIdx = -1;
  focuses.forEach((f, i) => { if (t >= (f.t ?? t0 + 0.3 + i * 1.4)) activeIdx = i; });
  const cur = activeIdx >= 0 ? focuses[activeIdx] : null;
  const fp = cur ? eout(prog(t, cur.t ?? t0, 0.45)) : 0;
  const sw = getSwatch(sk, cur?.c || 'amber');

  return (
    <div style={{
      width: w, height: h, borderRadius: sk.radius, overflow: 'hidden',
      background: sk.surface, border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Browser chrome */}
      <div style={{
        height: 58, padding: '0 22px', background: sk.surfaceAlt, borderBottom: `1.5px solid ${sk.divider}`,
        display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
      }}>
        <div style={{display: 'flex', gap: 8}}>
          {['#f45d48', '#f5c451', '#3dd68c'].map((c, i) => <div key={i} style={{width: 13, height: 13, borderRadius: 999, background: c}} />)}
        </div>
        <div style={{
          flex: 1, height: 34, borderRadius: 8, background: sk.surfaceMuted, padding: '0 16px',
          display: 'flex', alignItems: 'center', fontFamily: sk.fontEn, fontSize: 18, color: sk.inkSub,
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        }}>{e.url || e.title || 'https://example.com'}</div>
      </div>

      {/* Viewport with spotlight */}
      <div style={{flex: 1, position: 'relative', overflow: 'hidden', background: '#0c1018'}}>
        {e.src ? (
          <Img src={img(e.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sk.inkDim, fontFamily: sk.fontBody, fontSize: 28}}>
            [屏幕截图占位]
          </div>
        )}

        {/* Dim surroundings & spotlight active rect */}
        {cur && fp > 0.01 && (
          <>
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
              <defs>
                <mask id={`sc_mask_${activeIdx}_${sk.name}`}>
                  <rect width="1000" height="1000" fill="white" />
                  <rect x={cur.x * 1000} y={cur.y * 1000} width={cur.w * 1000} height={cur.h * 1000} rx="14" fill="black" />
                </mask>
              </defs>
              <rect width="1000" height="1000" fill={`rgba(6,8,14,${(0.62 * fp).toFixed(2)})`} mask={`url(#sc_mask_${activeIdx}_${sk.name})`} />
              <rect x={cur.x * 1000} y={cur.y * 1000} width={cur.w * 1000} height={cur.h * 1000} rx="14"
                fill="none" stroke={sw.solid} strokeWidth="6" opacity={fp} />
            </svg>
            <div style={{
              position: 'absolute', left: 26, right: 26, bottom: 24,
              padding: '16px 24px', borderRadius: sk.radiusSm,
              background: sk.surface, border: `2.5px solid ${sw.solid}`, boxShadow: sk.shadowSm,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              opacity: fp, transform: `translateY(${(1 - fp) * 16}px)`,
            }}>
              <div style={{
                padding: '6px 16px', borderRadius: 999, background: sw.solid, color: sw.onSolid,
                fontFamily: sk.fontBody, fontWeight: 900, fontSize: 22, whiteSpace: 'nowrap',
              }}>{cur.label}</div>
              {cur.note && <div style={{flex: 1, fontFamily: sk.fontTitle, fontSize: 30, color: sk.ink}}>{cur.note}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const XL3_ELS: any = {
  map_route: MapRoute,
  chat_thread: ChatThread,
  balance_scale: BalanceScale,
  trend_curve: TrendCurve,
  funnel_flow: FunnelFlow,
  network_web: NetworkWeb,
  split_compare: SplitCompare,
  gauge_meter: GaugeMeter,
  tree_branch: TreeBranch,
  screen_callout: ScreenCallout,
};

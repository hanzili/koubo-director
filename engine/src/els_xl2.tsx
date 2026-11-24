// els_xl2.tsx (2026-11-24): Wave-2 High-Craft Storytelling Components (8 primitives, fully skin-aware via skin_tokens.ts).
//   waffle_card    - Phone-shaped crisp card + 10x10 animated waffle share grid + top percentage & legend
//   quote_zoom     - 3D tilted real doc/web screenshot -> smooth zoom & straighten -> red circle/highlighter + bold Chinese punch
//   question_frame - Persistent top question bar + center seamless real-photo/doc window + bottom glowing reason cards
//   chapter_deck   - Illustrated chapter hero card + previous cards shrinking into a neat top mini-catalog row
//   top_tray       - Top sliding 3-card focus rail (active item centered & luminous while main canvas swaps below)
//   comic_grid     - Diagonal-cut manga/storyboard panels accumulating step-by-step on one page with crisp action tags
//   photo_hero     - Full-bleed magazine photo (no ugly white border!) + slow push-in + glowing big number OR vertical title
//   vs_duel        - High-craft stacked / side-by-side / upgrade duel cards with animated delta pill
import React from 'react';
import {Img} from 'remotion';
import {back, clamp, eio, eout, img, lerp, prog} from './lib';
import {getSkin, getSwatch, resolveAccent} from './skin_tokens';

const CJK = /[㐀-鿿＀-￯]/;

// ---------------------------------------------------------------- 1. waffle_card
export const WaffleCard: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 760, h = e.h ?? 1120;
  const t0 = e.t0 ?? e.t ?? 0;
  const segs: any[] = e.segs || [];
  const cells: {color: string; segIdx: number}[] = [];
  segs.forEach((s, idx) => {
    const col = resolveAccent(sk, s.color, 'amber');
    const n = Math.max(0, Math.min(100 - cells.length, Math.round(s.count ?? 0)));
    for (let k = 0; k < n; k++) cells.push({color: col, segIdx: idx});
  });
  while (cells.length < 100) cells.push({color: sk.name === 'cyber' ? '#1c2c42' : '#d9dde6', segIdx: -1});

  const sweepP = eio(prog(t, t0 + 0.12, 1.15));
  const litCount = Math.round(sweepP * 100);
  const bigP = back(prog(t, t0 + 0.95, 0.45));
  const bezelBg = sk.name === 'editorial'
    ? '#16161a'
    : sk.name === 'cyber'
      ? `linear-gradient(155deg,${sk.accent},#0b1a2e 48%,${sk.accent})`
      : 'linear-gradient(155deg,#e4e8f0,#9ca4b4 45%,#cfd5e0 75%,#7f8796)';

  return (
    <div style={{
      width: w, height: h, borderRadius: sk.name === 'editorial' ? 20 : sk.name === 'cyber' ? 26 : 56, padding: 12, boxSizing: 'border-box',
      background: bezelBg, boxShadow: sk.shadow, position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: sk.name === 'editorial' ? 12 : sk.name === 'cyber' ? 18 : 44,
        background: sk.paperBg, padding: '32px 42px 36px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{width: 148, height: 24, borderRadius: 16, background: sk.name === 'cyber' ? sk.border : '#141720', marginBottom: 20}} />
        <div style={{width: '100%', textAlign: 'center', marginBottom: 16}}>
          <div style={{fontFamily: sk.fontTitle, fontSize: 42, color: sk.paperInk, lineHeight: 1.15, letterSpacing: 1}}>{e.title}</div>
          {e.sub && <div style={{fontFamily: sk.fontEn, fontWeight: 700, fontSize: 17, color: sk.paperMuted, letterSpacing: 2, marginTop: 6}}>{e.sub}</div>}
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 18px', marginBottom: 22, width: '100%'}}>
          {segs.map((s, i) => {
            const col = resolveAccent(sk, s.color, 'amber');
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: sk.name === 'cyber' ? 'rgba(0,240,208,.08)' : '#f2f4f8',
                borderRadius: 999, padding: '7px 16px',
                opacity: eout(prog(t, t0 + 0.08 + i * 0.1, 0.3)),
              }}>
                <div style={{width: 16, height: 16, borderRadius: 5, background: col}} />
                <span style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 22, color: sk.paperInk}}>{s.label}</span>
                {s.pct && <span style={{fontFamily: sk.fontNum, fontSize: 24, color: col}}>{s.pct}</span>}
              </div>
            );
          })}
          {cells.some((c) => c.segIdx === -1) && (
            <div style={{display: 'flex', alignItems: 'center', gap: 8, background: sk.name === 'cyber' ? 'rgba(255,255,255,.06)' : '#f2f4f8', borderRadius: 999, padding: '7px 16px'}}>
              <div style={{width: 16, height: 16, borderRadius: 5, background: '#94a3b8'}} />
              <span style={{fontFamily: sk.fontBody, fontWeight: 700, fontSize: 22, color: sk.paperMuted}}>{e.otherLabel || '其它'}</span>
            </div>
          )}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8,
          width: 590, height: 590, padding: 14, borderRadius: sk.radiusSm,
          background: sk.name === 'cyber' ? '#070e1a' : '#f1f3f8', boxSizing: 'border-box',
        }}>
          {cells.map((c, idx) => {
            const on = idx < litCount;
            const localP = on ? clamp((sweepP * 100 - idx) / 4) : 0;
            return (
              <div key={idx} style={{
                borderRadius: sk.name === 'editorial' ? 4 : 9,
                background: on ? c.color : (sk.name === 'cyber' ? '#132033' : '#e4e8f0'),
                transform: `scale(${on ? lerp(0.75, 1, back(localP)) : 0.92})`,
              }} />
            );
          })}
        </div>
        {e.big && (
          <div style={{marginTop: 'auto', paddingTop: 18, textAlign: 'center', transform: `scale(${lerp(0.84, 1, bigP)})`, opacity: clamp(bigP * 1.4)}}>
            <div style={{fontFamily: sk.fontNum, fontSize: 108, lineHeight: 0.95, color: resolveAccent(sk, e.bigColor || segs[0]?.color, 'crimson'), letterSpacing: -1}}>{e.big}</div>
            {e.bigSub && <div style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 26, color: sk.paperMuted, marginTop: 6}}>{e.bigSub}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 2. quote_zoom
export const QuoteZoom: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 880, h = e.h ?? 940;
  const t0 = e.t ?? 0;
  const tZoom = e.tZoom ?? (t0 + 1.0);
  const zp = eio(prog(t, tZoom, 0.72));
  const hp = eout(prog(t, tZoom + 0.35, 0.55));
  const punchP = back(prog(t, tZoom + 0.55, 0.42));

  const fy = e.focusY ?? 0.46;
  const fh = e.focusH ?? 0.17;
  const ry = lerp(-12, 0, zp), rx = lerp(6, 0, zp), rz = lerp(-2.2, 0, zp);
  const sc = lerp(0.92, e.zoomScale ?? 1.14, zp);
  const shiftY = lerp(0, (0.42 - fy) * h * sc, zp);
  const [bx, by, bw, bh] = e.circleBox || [0.08, fy - fh / 2, 0.84, fh];
  const markColor = e.markColor || (e.mark === 'circle' ? sk.pal.crimson.solid : '#fde047');

  return (
    <div style={{width: w, height: h, position: 'relative', perspective: 1500}}>
      <div style={{
        width: w, height: h, borderRadius: sk.radius, overflow: 'hidden', position: 'relative',
        background: '#faf9f5',
        border: `2px solid ${sk.borderStrong}`,
        boxShadow: sk.shadow,
        transform: `translateY(${shiftY}px) scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        transformOrigin: '50% 50%',
      }}>
        {e.src ? (
          <Img src={img(e.src)} style={{width: '100%', height: '100%', objectFit: e.fit || 'cover', objectPosition: e.pos || '50% 25%', display: 'block'}} />
        ) : (
          <div style={{padding: '44px 48px', boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column', gap: 18}}>
            <div style={{borderBottom: '2px solid #e2e8f0', paddingBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontFamily: sk.fontEn, fontWeight: 800, fontSize: 22, color: '#0f172a', letterSpacing: 1}}>{e.docTitle || 'OFFICIAL RECORD'}</div>
                {e.docMeta && <div style={{fontFamily: sk.fontEn, fontSize: 16, color: '#64748b', marginTop: 4}}>{e.docMeta}</div>}
              </div>
              <div style={{padding: '6px 14px', borderRadius: 8, background: '#e2e8f0', fontFamily: sk.fontEn, fontWeight: 700, fontSize: 15, color: '#334155'}}>{e.docBadge || 'DOC'}</div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 6}}>
              {(e.docLines || []).map((ln: any, i: number) => {
                const isObj = typeof ln === 'object';
                const text = isObj ? ln.text : ln;
                const hi = isObj && ln.hi;
                return (
                  <div key={i} style={{
                    fontFamily: CJK.test(text) ? sk.fontBody : sk.fontEn,
                    fontWeight: hi ? 800 : 500, fontSize: hi ? 29 : 23, lineHeight: 1.48,
                    color: hi ? '#0f172a' : '#475569', padding: hi ? '10px 14px' : '2px 0', borderRadius: 10,
                    background: hi && e.mark !== 'circle' ? `rgba(253,224,71,${0.55 * hp})` : 'transparent',
                  }}>{text}</div>
                );
              })}
            </div>
          </div>
        )}
        {zp > 0.01 && (
          <>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${Math.max(0, by * 100)}%`, background: `rgba(8,10,16,${0.66 * zp})`, pointerEvents: 'none'}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: `${Math.min(100, (by + bh) * 100)}%`, bottom: 0, background: `rgba(8,10,16,${0.66 * zp})`, pointerEvents: 'none'}} />
          </>
        )}
        {hp > 0.01 && e.mark === 'hl' && e.src && (
          <div style={{position: 'absolute', left: `${bx * 100}%`, top: `${by * 100}%`, width: `${bw * 100 * hp}%`, height: `${bh * 100}%`, background: markColor, opacity: 0.42, mixBlendMode: 'multiply', borderRadius: 8}} />
        )}
        {hp > 0.01 && e.mark === 'box' && (
          <div style={{position: 'absolute', left: `${bx * 100}%`, top: `${by * 100}%`, width: `${bw * 100}%`, height: `${bh * 100}%`, border: `5px solid ${markColor}`, borderRadius: 14, opacity: hp}} />
        )}
        {hp > 0.01 && e.mark === 'circle' && (
          <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
            <ellipse cx={(bx + bw / 2) * w} cy={(by + bh / 2) * h} rx={(bw * w) / 2 + 12} ry={(bh * h) / 2 + 10}
              fill="none" stroke={markColor} strokeWidth={8} strokeLinecap="round" strokeDasharray={2200} strokeDashoffset={2200 * (1 - hp)} />
          </svg>
        )}
      </div>
      {e.zh && punchP > 0.01 && (
        <div style={{
          position: 'absolute', left: -24, right: -24, bottom: 38, display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: `translateY(${lerp(36, 0, punchP)}px) scale(${lerp(0.88, 1, punchP)})`, opacity: clamp(punchP * 1.3),
        }}>
          <div style={{
            background: sk.pal.crimson.bar, border: `2.5px solid ${sk.ink}`, borderRadius: sk.radiusSm,
            padding: '16px 36px', boxShadow: sk.shadow, textAlign: 'center',
          }}>
            <div style={{fontFamily: sk.fontTitle, fontSize: 56, color: '#ffffff', lineHeight: 1.15, letterSpacing: 2}}>{e.zh}</div>
            {e.zhSub && <div style={{fontFamily: sk.fontBody, fontWeight: 700, fontSize: 25, color: '#fef08a', marginTop: 8}}>{e.zhSub}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- 3. question_frame
export const QuestionFrame: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 980, h = e.h ?? 1180;
  const clips: any[] = e.clips || [], reasons: any[] = e.reasons || [];
  let clipIdx = 0;
  for (let i = 0; i < clips.length; i++) if (t >= (clips[i].t ?? 0)) clipIdx = i;
  const curClip = clips[clipIdx], prevClip = clipIdx > 0 ? clips[clipIdx - 1] : null;
  const fadeP = curClip ? eout(prog(t, curClip.t ?? 0, 0.28)) : 1;
  const ken = curClip ? 1 + clamp((t - (curClip.t ?? 0)) * 0.018, 0, 0.08) : 1;
  let activeR = -1;
  for (let i = 0; i < reasons.length; i++) if (t >= (reasons[i].t ?? 0)) activeR = i;

  return (
    <div style={{width: w, height: h, display: 'flex', flexDirection: 'column', gap: 22}}>
      <div style={{
        borderRadius: sk.radius, padding: '24px 34px', background: sk.surface,
        border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadowSm, textAlign: 'center',
      }}>
        <div style={{fontFamily: sk.fontTitle, fontSize: 48, color: sk.ink, lineHeight: 1.18, letterSpacing: 1.5}}>{e.question}</div>
        {e.en && <div style={{fontFamily: sk.fontEn, fontWeight: 700, fontSize: 18, color: sk.inkDim, letterSpacing: 2.5, marginTop: 8}}>{e.en}</div>}
      </div>
      <div style={{
        flex: 1, minHeight: 460, borderRadius: sk.radius, overflow: 'hidden', position: 'relative',
        background: '#0d1018', border: `2px solid ${sk.borderStrong}`, boxShadow: sk.shadow,
      }}>
        {prevClip && fadeP < 1 && <Img src={img(prevClip.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: prevClip.pos || '50% 50%'}} />}
        {curClip && <Img src={img(curClip.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: curClip.pos || '50% 50%', opacity: fadeP, transform: `scale(${ken})`}} />}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(180deg,transparent,rgba(8,10,16,.84))'}} />
        {curClip?.tag && (
          <div style={{
            position: 'absolute', left: 26, bottom: 24, background: 'rgba(12,15,24,.82)', border: `1.5px solid ${sk.accent}`,
            borderRadius: sk.radiusSm, padding: '10px 22px', fontFamily: sk.fontBody, fontWeight: 800, fontSize: 28, color: sk.accent, opacity: fadeP,
          }}>{curClip.tag}</div>
        )}
      </div>
      <div style={{display: 'flex', gap: 18, height: 220}}>
        {reasons.map((r, i) => {
          const revealed = t >= (r.t ?? 0), isCur = i === activeR;
          const sw = getSwatch(sk, i === 0 ? 'amber' : i === 1 ? 'teal' : 'crimson');
          const ac = resolveAccent(sk, r.accent, i === 0 ? 'amber' : i === 1 ? 'teal' : 'crimson');
          const pop = revealed ? back(prog(t, r.t ?? 0, 0.35)) : 0;
          return (
            <div key={i} style={{
              flex: 1, borderRadius: sk.radiusSm, padding: '22px 24px', boxSizing: 'border-box',
              background: isCur ? sw.bg : sk.surfaceAlt,
              border: `2px solid ${isCur ? ac : sk.border}`,
              boxShadow: isCur ? `${sk.shadowSm}, 0 0 24px ${sw.glow}` : sk.shadowSm,
              opacity: isCur ? 1 : revealed ? 0.72 : 0.42,
              transform: `scale(${isCur ? lerp(0.96, 1.02, pop) : 0.98})`,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 10,
            }}>
              <div style={{fontFamily: sk.fontEn, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: isCur ? ac : sk.inkDim}}>{r.badge || `REASON 0${i + 1}`}</div>
              <div style={{fontFamily: sk.fontTitle, fontSize: reasons.length >= 3 ? 38 : 44, lineHeight: 1.15, color: revealed ? sk.ink : sk.inkDim}}>{revealed ? r.title : (r.hiddenTitle || `原因 ${i + 1}`)}</div>
              {revealed && r.sub && <div style={{fontFamily: sk.fontBody, fontWeight: 600, fontSize: 22, color: sk.inkSub, lineHeight: 1.3}}>{r.sub}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 4. chapter_deck
export const ChapterDeck: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 960, h = e.h ?? 1160;
  const cards: any[] = e.cards || [];
  let active = 0;
  for (let i = 0; i < cards.length; i++) if (t >= (cards[i].t ?? 0)) active = i;
  const prevCards = cards.slice(0, active), cur = cards[active];
  const curP = cur ? back(prog(t, cur.t ?? 0, 0.45)) : 1;
  const ac = resolveAccent(sk, cur?.accent, 'amber');

  return (
    <div style={{width: w, height: h, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{height: 228, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, marginBottom: 24}}>
        {prevCards.map((c, i) => {
          const cac = resolveAccent(sk, c.accent, 'teal');
          const dockP = eout(prog(t, cur.t ?? 0, 0.4));
          return (
            <div key={i} style={{
              width: 210, height: 210, borderRadius: sk.radiusSm, overflow: 'hidden', position: 'relative',
              background: sk.surfaceAlt, border: `2px solid ${cac}`, boxShadow: sk.shadowSm,
              transform: `rotate(${(i - (prevCards.length - 1) / 2) * 3}deg) scale(${lerp(1.06, 1, dockP)})`,
              opacity: 0.88, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 16, boxSizing: 'border-box',
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 18, color: cac}}>{c.tag}</span>
                <span style={{width: 26, height: 26, borderRadius: 13, background: sk.pal.emerald.solid, color: sk.pal.emerald.onSolid, fontFamily: sk.fontBody, fontWeight: 900, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</span>
              </div>
              {c.src && <div style={{height: 82, borderRadius: 10, overflow: 'hidden', margin: '6px 0'}}><Img src={img(c.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>}
              <div style={{fontFamily: sk.fontTitle, fontSize: 28, color: sk.ink, lineHeight: 1.12, textAlign: 'center'}}>{c.title}</div>
            </div>
          );
        })}
      </div>
      {cur && (
        <div style={{
          width: 680, height: 870, borderRadius: sk.radius, overflow: 'hidden', position: 'relative',
          background: sk.surface, border: `3px solid ${ac}`, boxShadow: sk.shadow,
          transform: `translateY(${lerp(70, 0, curP)}px) scale(${lerp(0.86, 1, curP)})`, opacity: clamp(curP * 1.4),
          display: 'flex', flexDirection: 'column', padding: 34, boxSizing: 'border-box',
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
            <div style={{padding: '9px 24px', borderRadius: 999, background: ac, color: sk.mode === 'light' ? '#fff' : '#0c1018', fontFamily: sk.fontBody, fontWeight: 900, fontSize: 28, letterSpacing: 1.5}}>{cur.tag}</div>
            <div style={{fontFamily: sk.fontNum, fontSize: 38, color: sk.inkDim}}>0{active + 1} / 0{cards.length}</div>
          </div>
          <div style={{fontFamily: sk.fontTitle, fontSize: 78, color: sk.ink, lineHeight: 1.08, marginBottom: 22}}>{cur.title}</div>
          {cur.src && (
            <div style={{flex: 1, borderRadius: sk.radiusSm, overflow: 'hidden', position: 'relative', border: `1.5px solid ${sk.border}`, marginBottom: 22, background: '#0a0d14'}}>
              <Img src={img(cur.src)} style={{width: '100%', height: '100%', objectFit: cur.fit || 'cover', display: 'block'}} />
            </div>
          )}
          {cur.sub && (
            <div style={{padding: '18px 22px', borderRadius: sk.radiusSm, background: sk.surfaceSoft, border: `1px solid ${sk.border}`, fontFamily: sk.fontBody, fontWeight: 700, fontSize: 30, color: sk.ink, lineHeight: 1.35, textAlign: 'center'}}>
              {cur.sub}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- 5. top_tray
export const TopTray: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 980, h = e.h ?? 210;
  const items: any[] = e.items || [];
  let pos = 0;
  for (let i = 1; i < items.length; i++) if (t >= (items[i].t ?? 0)) pos = (i - 1) + eio(prog(t, items[i].t ?? 0, 0.4));
  const slotW = 290, gap = 30, step = slotW + gap, centerX = w / 2;
  return (
    <div style={{width: w, height: h, position: 'relative', overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)'}}>
      {items.map((it, i) => {
        const d = i - pos;
        if (Math.abs(d) > 2.2) return null;
        const near = clamp(1 - Math.abs(d)), x = centerX + d * step, sc = lerp(0.84, 1.04, near);
        const ac = resolveAccent(sk, it.accent, 'amber');
        return (
          <div key={i} style={{
            position: 'absolute', left: x - slotW / 2, top: (h - 172) / 2, width: slotW, height: 172, borderRadius: sk.radiusSm,
            background: near > 0.5 ? sk.paperBg : sk.surfaceAlt,
            border: `2.5px solid ${near > 0.5 ? ac : sk.border}`,
            boxShadow: near > 0.5 ? sk.shadowSm : 'none',
            transform: `scale(${sc})`, opacity: lerp(0.42, 1, near),
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 18px', boxSizing: 'border-box', textAlign: 'center',
          }}>
            {it.badge && <div style={{padding: '3px 12px', borderRadius: 999, background: near > 0.5 ? ac : sk.surfaceSoft, color: near > 0.5 ? (sk.mode === 'light' ? '#fff' : '#0e111a') : sk.inkDim, fontFamily: sk.fontEn, fontWeight: 800, fontSize: 16, letterSpacing: 1.5}}>{it.badge}</div>}
            <div style={{fontFamily: sk.fontTitle, fontSize: 40, lineHeight: 1.1, color: near > 0.5 ? sk.paperInk : sk.ink}}>{it.title}</div>
            {it.sub && <div style={{fontFamily: sk.fontBody, fontWeight: 700, fontSize: 20, color: near > 0.5 ? sk.paperMuted : sk.inkSub}}>{it.sub}</div>}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- 6. comic_grid
export const ComicGrid: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 940, h = e.h ?? 1080;
  const panels: any[] = e.panels || [];
  const topH = e.title ? 82 : 0, bodyH = h - topH;
  const boxes = panels.length === 3
    ? [
        {x: 0, y: 0, w, h: Math.round(bodyH * 0.48), clip: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)'},
        {x: 0, y: Math.round(bodyH * 0.45), w: Math.round(w * 0.51), h: Math.round(bodyH * 0.55), clip: 'polygon(0 8%, 100% 0, 94% 100%, 0 100%)'},
        {x: Math.round(w * 0.48), y: Math.round(bodyH * 0.42), w: Math.round(w * 0.52), h: Math.round(bodyH * 0.58), clip: 'polygon(6% 4%, 100% 0, 100% 100%, 0 100%)'},
      ]
    : [
        {x: 0, y: 0, w, h: Math.round(bodyH * 0.38), clip: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)'},
        {x: 0, y: Math.round(bodyH * 0.36), w: Math.round(w * 0.52), h: Math.round(bodyH * 0.33), clip: 'polygon(0 10%, 100% 0, 94% 94%, 0 100%)'},
        {x: Math.round(w * 0.48), y: Math.round(bodyH * 0.33), w: Math.round(w * 0.52), h: Math.round(bodyH * 0.36), clip: 'polygon(6% 4%, 100% 0, 100% 92%, 0 100%)'},
        {x: 0, y: Math.round(bodyH * 0.67), w, h: Math.round(bodyH * 0.33), clip: 'polygon(0 10%, 100% 0, 100% 100%, 0 100%)'},
      ];
  return (
    <div style={{width: w, height: h, position: 'relative'}}>
      {e.title && <div style={{height: topH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sk.fontTitle, fontSize: 48, color: sk.ink, letterSpacing: 2}}>{e.title}</div>}
      <div style={{position: 'relative', width: w, height: bodyH}}>
        {panels.slice(0, 4).map((p, i) => {
          const b = boxes[i], pp = back(prog(t, p.t ?? (e.t ?? 0) + i * 0.45, 0.38));
          if (pp <= 0.01) return null;
          return (
            <div key={i} style={{
              position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, clipPath: b.clip,
              background: sk.mode === 'light' ? '#16161a' : '#ffffff', padding: 6, boxSizing: 'border-box',
              transform: `scale(${lerp(0.86, 1, pp)})`, opacity: clamp(pp * 1.4), filter: 'drop-shadow(0 18px 34px rgba(0,0,0,.5))',
            }}>
              <div style={{width: '100%', height: '100%', clipPath: b.clip, position: 'relative', overflow: 'hidden', background: '#111520'}}>
                <Img src={img(p.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.pos || '50% 50%', filter: 'contrast(1.08) saturate(0.92)'}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(8,10,16,.12),rgba(8,10,16,.62))'}} />
                <div style={{position: 'absolute', left: 22, bottom: 26, background: '#ffffff', color: '#0f172a', border: '3px solid #0f172a', borderRadius: 10, padding: '7px 18px', boxShadow: '5px 5px 0 #0f172a', display: 'flex', alignItems: 'center', gap: 10}}>
                  <span style={{background: sk.accent, color: sk.accentInk, borderRadius: 6, padding: '2px 8px', fontFamily: sk.fontNum, fontSize: 24}}>0{i + 1}</span>
                  <span style={{fontFamily: sk.fontTitle, fontSize: 34, lineHeight: 1.1}}>{p.tag}</span>
                </div>
                {p.sub && <div style={{position: 'absolute', right: 20, top: 24, background: 'rgba(12,15,24,.82)', borderRadius: 10, padding: '6px 14px', fontFamily: sk.fontBody, fontWeight: 700, fontSize: 21, color: sk.accent}}>{p.sub}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 7. photo_hero
export const PhotoHero: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const w = e.w ?? 1080, h = e.h ?? 1920;
  const t0 = e.t ?? 0;
  const ken = 1 + clamp((t - t0) * 0.016, 0, 0.08);
  const p = back(prog(t, t0 + 0.08, 0.45));
  const ac = e.accent || sk.accent;
  return (
    <div style={{width: w, height: h, position: 'relative', overflow: 'hidden', background: '#090b10'}}>
      <Img src={img(e.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: e.pos || '50% 45%', transform: `scale(${ken})`, filter: 'brightness(0.72) contrast(1.06)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(8,10,16,.76) 0%,rgba(8,10,16,.24) 38%,rgba(8,10,16,.38) 68%,rgba(8,10,16,.88) 100%)'}} />
      {e.mode === 'vertical' ? (
        <div style={{position: 'absolute', left: 86, top: 210, display: 'flex', alignItems: 'flex-start', gap: 24, opacity: clamp(p * 1.4), transform: `translateY(${lerp(36, 0, p)}px)`}}>
          <div style={{width: 6, height: 420, borderRadius: 4, background: `linear-gradient(180deg,${ac},transparent)`}} />
          <div style={{writingMode: 'vertical-rl', fontFamily: sk.fontTitle, fontSize: 122, color: '#ffffff', letterSpacing: 14, lineHeight: 1.05, textShadow: '0 14px 40px rgba(0,0,0,.78)'}}>{e.title}</div>
          {e.en && <div style={{writingMode: 'vertical-rl', fontFamily: sk.fontEn, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,.68)', letterSpacing: 4, marginTop: 10}}>{e.en}</div>}
        </div>
      ) : (
        <div style={{position: 'absolute', left: 54, right: 54, top: '34%', transform: 'translateY(-35%)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
          {e.kicker && <div style={{fontFamily: sk.fontTitle, fontSize: 44, color: '#ffffff', letterSpacing: 3, textShadow: '0 6px 20px rgba(0,0,0,.7)', opacity: eout(prog(t, t0 + 0.05, 0.35))}}>{e.kicker}</div>}
          {e.en && <div style={{fontFamily: sk.fontEn, fontWeight: 700, fontSize: 20, color: 'rgba(255,255,255,.62)', letterSpacing: 3, marginTop: 6}}>{e.en}</div>}
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 10, marginTop: 18, transform: `scale(${lerp(0.82, 1, p)})`, opacity: clamp(p * 1.4)}}>
            <span style={{fontFamily: sk.fontNum, fontSize: e.valSize ?? 210, lineHeight: 0.92, color: ac, textShadow: `0 18px 54px rgba(0,0,0,.85)`}}>{e.value}</span>
            {e.unit && <span style={{fontFamily: sk.fontTitle, fontSize: 74, color: ac, textShadow: '0 12px 32px rgba(0,0,0,.85)'}}>{e.unit}</span>}
          </div>
          {e.sub && <div style={{marginTop: 22, padding: '12px 30px', borderRadius: 999, background: 'rgba(10,12,20,.72)', border: '1.5px solid rgba(255,255,255,.22)', fontFamily: sk.fontBody, fontWeight: 800, fontSize: 30, color: '#f6f4ee', opacity: eout(prog(t, t0 + 0.3, 0.35))}}>{e.sub}</div>}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- 8. vs_duel
export const VsDuel: React.FC<any> = ({e, t}) => {
  const sk = getSkin(e.skin);
  const mode = e.mode || 'stack';
  const t0 = e.t ?? 0;
  const pA = back(prog(t, t0 + 0.05, 0.4));
  const pB = back(prog(t, e.tB ?? (t0 + 0.45), 0.4));
  const pD = back(prog(t, e.tDelta ?? (t0 + 0.85), 0.4));
  const a = e.a || {}, b = e.b || {};
  const swA = getSwatch(sk, a.c || 'crimson'), swB = getSwatch(sk, b.c || 'teal');
  const acA = resolveAccent(sk, a.accent || a.c, 'crimson');
  const acB = resolveAccent(sk, b.accent || b.c, 'teal');

  if (mode === 'chest') {
    const w = e.w ?? 920;
    return (
      <div style={{width: w, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}>
        {[{d: a, p: pA, ac: acA, sw: swA}, {d: b, p: pB, ac: acB, sw: swB}].map(({d, p, ac, sw}, i) => (
          <div key={i} style={{
            flex: 1, height: 220, borderRadius: sk.radius, padding: '24px 28px', boxSizing: 'border-box',
            background: sk.mode === 'light' ? sw.bg : sk.surface,
            border: `2.5px solid ${ac}`, boxShadow: sk.shadowSm,
            transform: `scale(${lerp(0.84, 1, p)})`, opacity: clamp(p * 1.4),
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 8,
          }}>
            {d.badge && <div style={{fontFamily: sk.fontEn, fontWeight: 800, fontSize: 17, color: ac, letterSpacing: 2}}>{d.badge}</div>}
            <div style={{fontFamily: sk.fontTitle, fontSize: 48, color: sk.ink, lineHeight: 1.1}}>{d.title}</div>
            {d.value && <div style={{fontFamily: sk.fontNum, fontSize: 54, color: ac, lineHeight: 1}}>{d.value}</div>}
            {d.sub && <div style={{fontFamily: sk.fontBody, fontWeight: 700, fontSize: 22, color: sk.inkSub}}>{d.sub}</div>}
          </div>
        ))}
      </div>
    );
  }

  if (mode === 'upgrade') {
    const w = e.w ?? 960, h = e.h ?? 860;
    return (
      <div style={{width: w, height: h, display: 'flex', flexDirection: 'column', gap: 26}}>
        {e.title && <div style={{fontFamily: sk.fontTitle, fontSize: 52, color: sk.ink, textAlign: 'center', letterSpacing: 1.5}}>{e.title}</div>}
        <div style={{flex: 1, display: 'flex', alignItems: 'stretch', gap: 26, position: 'relative'}}>
          {[{d: a, p: pA, ac: acA, sw: swA, dim: true}, {d: b, p: pB, ac: acB, sw: swB, dim: false}].map(({d, p, ac, sw, dim}, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: sk.radius, padding: '32px 28px', boxSizing: 'border-box',
              background: dim ? sk.surfaceAlt : (sk.mode === 'light' ? sw.bg : sk.surface),
              border: `2.5px solid ${dim ? sk.border : ac}`, boxShadow: sk.shadow,
              transform: `translateY(${lerp(42, 0, p)}px) scale(${lerp(0.92, 1, p)})`, opacity: clamp(p * 1.4),
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'space-between',
            }}>
              <div style={{padding: '7px 22px', borderRadius: 999, background: dim ? sk.surfaceSoft : ac, color: dim ? sk.inkSub : (sk.mode === 'light' ? '#fff' : '#0a1016'), fontFamily: sk.fontBody, fontWeight: 900, fontSize: 24}}>
                {d.badge || (i === 0 ? '旧做法' : '新做法')}
              </div>
              <div style={{fontFamily: sk.fontTitle, fontSize: 48, color: sk.ink, lineHeight: 1.15}}>{d.title}</div>
              {d.src && <div style={{width: '100%', height: 220, borderRadius: sk.radiusSm, overflow: 'hidden', border: `1px solid ${sk.border}`}}><Img src={img(d.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>}
              <div style={{fontFamily: sk.fontNum, fontSize: 88, color: ac, lineHeight: 0.96}}>{d.value}</div>
              {d.sub && <div style={{width: '100%', padding: '14px 16px', boxSizing: 'border-box', borderRadius: sk.radiusSm, background: sk.surfaceSoft, fontFamily: sk.fontBody, fontWeight: 700, fontSize: 24, color: dim ? sk.inkSub : sk.ink, lineHeight: 1.35}}>{d.sub}</div>}
            </div>
          ))}
          {e.delta && pD > 0.01 && (
            <div style={{
              position: 'absolute', left: '50%', top: '43%', transform: `translate(-50%,-50%) scale(${lerp(0.7, 1, pD)})`, opacity: clamp(pD * 1.4),
              background: sk.accent, color: sk.accentInk, border: `3px solid ${sk.ink}`, borderRadius: 999, padding: '12px 26px',
              boxShadow: sk.shadowSm, fontFamily: sk.fontTitle, fontSize: 32, whiteSpace: 'nowrap', zIndex: 5,
            }}>{e.delta}</div>
          )}
        </div>
      </div>
    );
  }

  const w = e.w ?? 900, h = e.h ?? 940;
  return (
    <div style={{width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative'}}>
      {e.title && <div style={{fontFamily: sk.fontTitle, fontSize: 50, color: sk.ink, textAlign: 'center', marginBottom: 14, letterSpacing: 1.5}}>{e.title}</div>}
      {[{d: a, p: pA, ac: acA, sw: swA}, {d: b, p: pB, ac: acB, sw: swB}].map(({d, p, ac, sw}, i) => (
        <div key={i} style={{
          height: e.title ? 390 : 430, borderRadius: sk.radius, padding: '30px 36px', boxSizing: 'border-box',
          background: sk.mode === 'light' ? sw.bg : sk.surface,
          border: `2.5px solid ${ac}`, boxShadow: sk.shadow,
          transform: `translateX(${lerp(i === 0 ? -50 : 50, 0, p)}px) scale(${lerp(0.92, 1, p)})`, opacity: clamp(p * 1.4),
          display: 'flex', alignItems: 'center', gap: 28,
        }}>
          {d.src && <div style={{width: 240, height: 290, borderRadius: sk.radiusSm, overflow: 'hidden', flexShrink: 0, border: `1.5px solid ${sk.border}`}}><Img src={img(d.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
            {d.badge && <div style={{alignSelf: 'flex-start', padding: '5px 16px', borderRadius: 999, background: ac, color: sk.mode === 'light' ? '#fff' : '#0b0e16', fontFamily: sk.fontBody, fontWeight: 900, fontSize: 22}}>{d.badge}</div>}
            <div style={{fontFamily: sk.fontTitle, fontSize: 48, color: sk.ink, lineHeight: 1.12}}>{d.title}</div>
            <div style={{fontFamily: sk.fontNum, fontSize: 96, color: ac, lineHeight: 0.95}}>{d.value}</div>
            {d.sub && <div style={{fontFamily: sk.fontBody, fontWeight: 700, fontSize: 25, color: sk.inkSub, lineHeight: 1.3}}>{d.sub}</div>}
          </div>
        </div>
      ))}
      {e.delta && pD > 0.01 && (
        <div style={{
          position: 'absolute', left: '50%', top: e.title ? '54%' : '50%',
          transform: `translate(-50%,-50%) scale(${lerp(0.65, 1, pD)})`, opacity: clamp(pD * 1.4),
          background: sk.accent, color: sk.accentInk, borderRadius: 999, padding: '14px 36px',
          border: `3px solid ${sk.ink}`, boxShadow: sk.shadow,
          display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', zIndex: 6,
        }}>
          <span style={{fontFamily: sk.fontTitle, fontSize: 40}}>{e.delta}</span>
          {e.deltaSub && <span style={{fontFamily: sk.fontBody, fontWeight: 800, fontSize: 24, opacity: 0.85}}>{e.deltaSub}</span>}
        </div>
      )}
    </div>
  );
};

export const XL2_ELS: any = {
  waffle_card: WaffleCard,
  quote_zoom: QuoteZoom,
  question_frame: QuestionFrame,
  chapter_deck: ChapterDeck,
  top_tray: TopTray,
  comic_grid: ComicGrid,
  photo_hero: PhotoHero,
  vs_duel: VsDuel,
};

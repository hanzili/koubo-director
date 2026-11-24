// skin_tokens.ts (2026-11-24): Unified Design Token Skin System for Koubo Director Engine.
// Decouples visual brand identity (palette, surface, typography, borders, shadows, PiP, subtitles, canvas)
// from storytelling logic across all 26 studio components (els_story, els_xl2, els_xl3).
//
// Select globally in project.json / shots.json:  "skin": "obsidian" | "editorial" | "cyber" | "vintage"
// Or override per scene/element for multi-style demos:  e.skin = "editorial"
import React from 'react';
import {AbsoluteFill} from 'remotion';
import D from './data/shots.json';
import {F} from './lib';

export interface Swatch {
  bg: string;       // card/row surface fill
  bar: string;      // vertical/horizontal solid accent gradient
  rim: string;      // strong accent stroke / highlight color
  glow: string;     // soft ambient glow (or crisp tint on light themes)
  text: string;     // high-contrast accent text color on card surface
  solid: string;    // single hex color for SVG strokes / pills / badges
  onSolid: string;  // text color placed ON solid pill
}

export interface Skin {
  name: 'obsidian' | 'editorial' | 'cyber' | 'vintage';
  label: string;
  mode: 'dark' | 'light';
  canvasBg: string;
  canvasGrid?: string;
  canvasGlowA?: string;
  canvasGlowB?: string;
  surface: string;
  surfaceAlt: string;
  surfaceMuted: string;
  surfaceSoft: string;
  paperBg: string;
  paperInk: string;
  paperMuted: string;
  border: string;
  borderStrong: string;
  divider: string;
  radius: number;
  radiusSm: number;
  shadow: string;
  shadowSm: string;
  ink: string;
  inkSub: string;
  inkDim: string;
  accent: string;
  accent2: string;
  accentInk: string;
  fontTitle: string;
  fontBody: string;
  fontNum: string;
  fontEn: string;
  pip: {
    shape: 'circle' | 'rounded' | 'square';
    border: string;
    borderWidth: number;
    shadow: string;
  };
  sub: {
    font: string;
    color: string;
    stroke: string;
    bg?: string;
  };
  map: {
    ocean: string;
    land: string;
    landStroke: string;
    graticule: string;
  };
  pal: Record<'royal' | 'teal' | 'amber' | 'crimson' | 'plum' | 'emerald' | 'slate', Swatch>;
}

export const SKINS: Record<Skin['name'], Skin> = {
  // 1. 深海财经 (Obsidian Finance — default, 100% compatible with ep05-07 v2)
  obsidian: {
    name: 'obsidian',
    label: '深海财经',
    mode: 'dark',
    canvasBg: 'radial-gradient(ellipse 90% 60% at 50% 22%, #172138 0%, #0b101b 62%, #070a12 100%)',
    canvasGrid: 'radial-gradient(rgba(148,178,235,.14) 1.5px, transparent 1.5px)',
    canvasGlowA: 'rgba(47,212,181,.12)',
    canvasGlowB: 'rgba(79,158,255,.11)',
    surface: 'linear-gradient(165deg, rgba(16,20,28,.93) 0%, rgba(10,12,18,.96) 100%)',
    surfaceAlt: 'linear-gradient(135deg, rgba(30,33,42,.95) 0%, rgba(18,20,27,.97) 100%)',
    surfaceMuted: 'rgba(255,255,255,.055)',
    surfaceSoft: 'rgba(255,255,255,.09)',
    paperBg: '#fbfbfd',
    paperInk: '#141824',
    paperMuted: '#64748b',
    border: 'rgba(255,255,255,.18)',
    borderStrong: 'rgba(255,255,255,.28)',
    divider: 'rgba(255,255,255,.14)',
    radius: 28,
    radiusSm: 16,
    shadow: '0 36px 80px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.16)',
    shadowSm: '0 14px 32px rgba(0,0,0,.44)',
    ink: '#f6f3e8',
    inkSub: 'rgba(245,242,235,.76)',
    inkDim: 'rgba(240,236,225,.48)',
    accent: '#f5c451',
    accent2: '#2fd4b5',
    accentInk: '#0b0e16',
    fontTitle: F.ys,
    fontBody: F.heavy,
    fontNum: F.num,
    fontEn: F.en,
    pip: {shape: 'circle', border: '#efe0a8', borderWidth: 5, shadow: '0 14px 40px rgba(0,0,0,.6)'},
    sub: {font: F.ys, color: '#ffffff', stroke: 'rgba(18,18,24,.92)'},
    map: {ocean: '#0d1526', land: '#1f2d47', landStroke: 'rgba(160,190,235,.28)', graticule: 'rgba(130,165,220,.10)'},
    pal: {
      teal:    {bg: 'linear-gradient(90deg, rgba(24,78,82,.92) 0%, rgba(16,38,44,.94) 100%)',  bar: 'linear-gradient(180deg,#52c7b8,#1f6f78)', rim: '#58d5c6', glow: 'rgba(82,199,184,.35)', text: '#aef3ea', solid: '#2fd4b5', onSolid: '#081a18'},
      plum:    {bg: 'linear-gradient(90deg, rgba(72,44,98,.92) 0%, rgba(30,22,46,.94) 100%)',  bar: 'linear-gradient(180deg,#a77be8,#5b3a8a)', rim: '#b48df0', glow: 'rgba(167,123,232,.35)', text: '#dfd0ff', solid: '#a67cff', onSolid: '#140b24'},
      royal:   {bg: 'linear-gradient(90deg, rgba(38,68,128,.92) 0%, rgba(20,30,56,.94) 100%)', bar: 'linear-gradient(180deg,#64a0ff,#2952a3)', rim: '#7ab0ff', glow: 'rgba(100,160,255,.35)', text: '#cfe2ff', solid: '#4f9eff', onSolid: '#08152b'},
      crimson: {bg: 'linear-gradient(90deg, rgba(118,38,48,.92) 0%, rgba(44,18,24,.94) 100%)', bar: 'linear-gradient(180deg,#f06a6a,#9e2832)', rim: '#ff7d7d', glow: 'rgba(240,106,106,.35)', text: '#ffd1d1', solid: '#f45d48', onSolid: '#ffffff'},
      amber:   {bg: 'linear-gradient(90deg, rgba(118,78,24,.92) 0%, rgba(46,32,16,.94) 100%)', bar: 'linear-gradient(180deg,#f6be52,#b26f18)', rim: '#f8cb6b', glow: 'rgba(246,190,82,.35)',  text: '#ffe8b6', solid: '#f5c451', onSolid: '#1a1204'},
      emerald: {bg: 'linear-gradient(90deg, rgba(32,92,62,.92) 0%, rgba(16,40,28,.94) 100%)',  bar: 'linear-gradient(180deg,#58d68d,#1f7a48)', rim: '#6ce29d', glow: 'rgba(88,214,141,.35)',  text: '#c8f9dc', solid: '#3dd68c', onSolid: '#071d12'},
      slate:   {bg: 'linear-gradient(90deg, rgba(46,52,66,.92) 0%, rgba(22,25,34,.94) 100%)',  bar: 'linear-gradient(180deg,#94a3b8,#475569)', rim: '#a8b8ce', glow: 'rgba(148,163,184,.28)', text: '#e2e8f0', solid: '#94a3b8', onSolid: '#0f172a'},
    },
  },

  // 2. 暖白杂志 (Editorial Paper — Vox / New Yorker / Documentary aesthetic)
  editorial: {
    name: 'editorial',
    label: '暖白杂志',
    mode: 'light',
    canvasBg: 'linear-gradient(180deg, #f7f2e8 0%, #efe7d8 100%)',
    canvasGrid: 'linear-gradient(rgba(22,22,26,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(22,22,26,.055) 1px, transparent 1px)',
    canvasGlowA: 'rgba(217,56,41,.05)',
    canvasGlowB: 'rgba(29,78,216,.05)',
    surface: '#fffdf8',
    surfaceAlt: '#f8f3e8',
    surfaceMuted: '#ede6d6',
    surfaceSoft: 'rgba(22,22,26,.055)',
    paperBg: '#fffdf8',
    paperInk: '#16161a',
    paperMuted: '#5b5850',
    border: 'rgba(22,22,26,.22)',
    borderStrong: '#16161a',
    divider: 'rgba(22,22,26,.16)',
    radius: 8,
    radiusSm: 6,
    shadow: '0 18px 42px rgba(24,20,14,.12), 6px 6px 0 rgba(22,22,26,.92)',
    shadowSm: '0 8px 20px rgba(24,20,14,.09), 3px 3px 0 rgba(22,22,26,.85)',
    ink: '#16161a',
    inkSub: '#47443d',
    inkDim: '#7d776b',
    accent: '#d63628',
    accent2: '#1d4ed8',
    accentInk: '#fffdf8',
    fontTitle: F.serifsc,
    fontBody: F.heavy,
    fontNum: F.din,
    fontEn: F.serif,
    pip: {shape: 'rounded', border: '#16161a', borderWidth: 5, shadow: '6px 6px 0 rgba(22,22,26,.92)'},
    sub: {font: F.serifsc, color: '#fffdf8', stroke: '#16161a', bg: 'rgba(22,22,26,.88)'},
    map: {ocean: '#eae2d1', land: '#fbf7ee', landStroke: 'rgba(22,22,26,.34)', graticule: 'rgba(22,22,26,.08)'},
    pal: {
      teal:    {bg: '#e6f4f1', bar: 'linear-gradient(180deg,#0f766e,#115e59)', rim: '#0f766e', glow: 'rgba(15,118,110,.14)', text: '#0f5c56', solid: '#0f766e', onSolid: '#ffffff'},
      plum:    {bg: '#f1eafc', bar: 'linear-gradient(180deg,#6d28d9,#5b21b6)', rim: '#6d28d9', glow: 'rgba(109,40,217,.14)', text: '#5b21b6', solid: '#6d28d9', onSolid: '#ffffff'},
      royal:   {bg: '#e8eefc', bar: 'linear-gradient(180deg,#1d4ed8,#1e40af)', rim: '#1d4ed8', glow: 'rgba(29,78,216,.14)',  text: '#1e3a8a', solid: '#1d4ed8', onSolid: '#ffffff'},
      crimson: {bg: '#fcebe9', bar: 'linear-gradient(180deg,#d63628,#b42318)', rim: '#d63628', glow: 'rgba(214,54,40,.14)',  text: '#9f1d14', solid: '#d63628', onSolid: '#ffffff'},
      amber:   {bg: '#fdf2db', bar: 'linear-gradient(180deg,#c27803,#92400e)', rim: '#b45309', glow: 'rgba(180,83,9,.14)',   text: '#92400e', solid: '#c27803', onSolid: '#ffffff'},
      emerald: {bg: '#e7f6ec', bar: 'linear-gradient(180deg,#15803d,#166534)', rim: '#15803d', glow: 'rgba(21,128,61,.14)',  text: '#166534', solid: '#15803d', onSolid: '#ffffff'},
      slate:   {bg: '#efede8', bar: 'linear-gradient(180deg,#475569,#334155)', rim: '#475569', glow: 'rgba(71,85,105,.12)',  text: '#334155', solid: '#475569', onSolid: '#ffffff'},
    },
  },

  // 3. 极客暗黑 (Cyber Tech — AI / Engineering / Quant aesthetic)
  cyber: {
    name: 'cyber',
    label: '极客暗黑',
    mode: 'dark',
    canvasBg: 'radial-gradient(ellipse 80% 55% at 50% 20%, #0d1d33 0%, #050912 65%, #03050a 100%)',
    canvasGrid: 'linear-gradient(rgba(0,240,208,.075) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,208,.075) 1px, transparent 1px)',
    canvasGlowA: 'rgba(0,240,208,.15)',
    canvasGlowB: 'rgba(198,255,46,.10)',
    surface: 'linear-gradient(160deg, rgba(10,18,32,.95) 0%, rgba(5,9,17,.98) 100%)',
    surfaceAlt: 'linear-gradient(145deg, rgba(14,25,44,.95) 0%, rgba(8,14,26,.98) 100%)',
    surfaceMuted: 'rgba(0,240,208,.05)',
    surfaceSoft: 'rgba(0,240,208,.10)',
    paperBg: '#0c1524',
    paperInk: '#e6f7f5',
    paperMuted: '#7fa4b8',
    border: 'rgba(0,240,208,.32)',
    borderStrong: 'rgba(0,240,208,.75)',
    divider: 'rgba(0,240,208,.20)',
    radius: 12,
    radiusSm: 8,
    shadow: '0 28px 70px rgba(0,0,0,.78), 0 0 28px rgba(0,240,208,.14)',
    shadowSm: '0 12px 28px rgba(0,0,0,.62), 0 0 14px rgba(0,240,208,.12)',
    ink: '#eefdfa',
    inkSub: '#9ec5d6',
    inkDim: '#5d7f94',
    accent: '#00f0d0',
    accent2: '#c6ff2e',
    accentInk: '#031214',
    fontTitle: F.heavy,
    fontBody: F.heavy,
    fontNum: F.din,
    fontEn: F.px,
    pip: {shape: 'square', border: '#00f0d0', borderWidth: 4, shadow: '0 0 26px rgba(0,240,208,.55)'},
    sub: {font: F.heavy, color: '#eefdfa', stroke: '#040a12'},
    map: {ocean: '#040a14', land: '#10243b', landStroke: 'rgba(0,240,208,.35)', graticule: 'rgba(0,240,208,.10)'},
    pal: {
      teal:    {bg: 'linear-gradient(90deg, rgba(0,90,82,.75) 0%, rgba(6,28,36,.95) 100%)',   bar: 'linear-gradient(180deg,#00f0d0,#009e8e)', rim: '#00f0d0', glow: 'rgba(0,240,208,.36)',  text: '#7dffec', solid: '#00f0d0', onSolid: '#031514'},
      plum:    {bg: 'linear-gradient(90deg, rgba(84,26,118,.78) 0%, rgba(20,10,36,.95) 100%)', bar: 'linear-gradient(180deg,#c084fc,#7e22ce)', rim: '#d8b4fe', glow: 'rgba(192,132,252,.36)', text: '#eed6ff', solid: '#c084fc', onSolid: '#140524'},
      royal:   {bg: 'linear-gradient(90deg, rgba(16,66,138,.78) 0%, rgba(8,20,44,.95) 100%)',  bar: 'linear-gradient(180deg,#38bdf8,#0284c7)', rim: '#38bdf8', glow: 'rgba(56,189,248,.36)',  text: '#bae6fd', solid: '#38bdf8', onSolid: '#031626'},
      crimson: {bg: 'linear-gradient(90deg, rgba(132,18,68,.78) 0%, rgba(36,8,22,.95) 100%)',  bar: 'linear-gradient(180deg,#ff3b9a,#be123c)', rim: '#ff4da6', glow: 'rgba(255,59,154,.38)',  text: '#ffc2df', solid: '#ff3b9a', onSolid: '#ffffff'},
      amber:   {bg: 'linear-gradient(90deg, rgba(110,78,8,.78) 0%, rgba(30,22,6,.95) 100%)',   bar: 'linear-gradient(180deg,#ffb703,#d97706)', rim: '#ffb703', glow: 'rgba(255,183,3,.36)',   text: '#ffe49e', solid: '#ffb703', onSolid: '#1a1100'},
      emerald: {bg: 'linear-gradient(90deg, rgba(58,108,12,.78) 0%, rgba(16,32,6,.95) 100%)',  bar: 'linear-gradient(180deg,#c6ff2e,#65a30d)', rim: '#c6ff2e', glow: 'rgba(198,255,46,.36)',  text: '#e8ff9e', solid: '#c6ff2e', onSolid: '#101d02'},
      slate:   {bg: 'linear-gradient(90deg, rgba(36,52,72,.80) 0%, rgba(12,18,28,.95) 100%)',  bar: 'linear-gradient(180deg,#64748b,#334155)', rim: '#94a3b8', glow: 'rgba(148,163,184,.25)', text: '#cbd5e1', solid: '#94a3b8', onSolid: '#09101a'},
    },
  },

  // 4. 复古胶片手账 (Vintage Film & Journal — Storytelling / Founder / Case Study aesthetic)
  vintage: {
    name: 'vintage',
    label: '复古手账',
    mode: 'dark',
    canvasBg: 'radial-gradient(ellipse 85% 60% at 50% 25%, #30251c 0%, #1b1510 64%, #120e0b 100%)',
    canvasGrid: 'radial-gradient(rgba(242,226,196,.10) 1.5px, transparent 1.5px)',
    canvasGlowA: 'rgba(217,155,38,.12)',
    canvasGlowB: 'rgba(214,90,49,.10)',
    surface: 'linear-gradient(165deg, rgba(44,35,27,.95) 0%, rgba(28,22,17,.97) 100%)',
    surfaceAlt: 'linear-gradient(145deg, rgba(54,43,33,.95) 0%, rgba(34,27,21,.97) 100%)',
    surfaceMuted: 'rgba(244,231,207,.065)',
    surfaceSoft: 'rgba(244,231,207,.11)',
    paperBg: '#f4ead5',
    paperInk: '#261d16',
    paperMuted: '#6f5e4d',
    border: 'rgba(242,222,188,.24)',
    borderStrong: 'rgba(242,222,188,.48)',
    divider: 'rgba(242,222,188,.16)',
    radius: 20,
    radiusSm: 12,
    shadow: '0 30px 72px rgba(0,0,0,.64), inset 0 1px 0 rgba(255,238,205,.14)',
    shadowSm: '0 14px 30px rgba(0,0,0,.46)',
    ink: '#f6ecd8',
    inkSub: 'rgba(246,236,216,.76)',
    inkDim: 'rgba(232,216,188,.50)',
    accent: '#e0a93b',
    accent2: '#d96342',
    accentInk: '#1c140e',
    fontTitle: F.serifsc,
    fontBody: F.heavy,
    fontNum: F.serif,
    fontEn: F.serif,
    pip: {shape: 'circle', border: '#e8cfa0', borderWidth: 5, shadow: '0 16px 40px rgba(0,0,0,.65)'},
    sub: {font: F.serifsc, color: '#fdf5e6', stroke: '#1b140f'},
    map: {ocean: '#201913', land: '#3b3025', landStroke: 'rgba(242,222,188,.30)', graticule: 'rgba(242,222,188,.08)'},
    pal: {
      teal:    {bg: 'linear-gradient(90deg, rgba(52,88,74,.90) 0%, rgba(28,44,38,.95) 100%)',  bar: 'linear-gradient(180deg,#68a88d,#3b6b57)', rim: '#7ec4a6', glow: 'rgba(104,168,141,.28)', text: '#cceee0', solid: '#68a88d', onSolid: '#102119'},
      plum:    {bg: 'linear-gradient(90deg, rgba(96,58,76,.90) 0%, rgba(44,26,35,.95) 100%)',  bar: 'linear-gradient(180deg,#c27ba0,#7a425e)', rim: '#d697b8', glow: 'rgba(194,123,160,.28)', text: '#f2d3e3', solid: '#c27ba0', onSolid: '#240f19'},
      royal:   {bg: 'linear-gradient(90deg, rgba(56,82,108,.90) 0%, rgba(28,40,54,.95) 100%)', bar: 'linear-gradient(180deg,#7ca4cc,#466687)', rim: '#93bae0', glow: 'rgba(124,164,204,.28)', text: '#d4e8fc', solid: '#7ca4cc', onSolid: '#101d2b'},
      crimson: {bg: 'linear-gradient(90deg, rgba(138,60,42,.90) 0%, rgba(56,24,18,.95) 100%)', bar: 'linear-gradient(180deg,#e06d4d,#a63e24)', rim: '#f08769', glow: 'rgba(224,109,77,.30)',  text: '#ffd9cc', solid: '#e06d4d', onSolid: '#240c06'},
      amber:   {bg: 'linear-gradient(90deg, rgba(132,92,32,.90) 0%, rgba(54,38,16,.95) 100%)', bar: 'linear-gradient(180deg,#e5b045,#a6761b)', rim: '#f2c361', glow: 'rgba(229,176,69,.30)',  text: '#ffebc2', solid: '#e5b045', onSolid: '#241804'},
      emerald: {bg: 'linear-gradient(90deg, rgba(64,96,56,.90) 0%, rgba(30,46,26,.95) 100%)',  bar: 'linear-gradient(180deg,#86b874,#4c783d)', rim: '#9fd18c', glow: 'rgba(134,184,116,.28)', text: '#ddf5d3', solid: '#86b874', onSolid: '#13240d'},
      slate:   {bg: 'linear-gradient(90deg, rgba(78,70,62,.90) 0%, rgba(38,34,30,.95) 100%)',  bar: 'linear-gradient(180deg,#b5a694,#786c5e)', rim: '#c7b9a7', glow: 'rgba(181,166,148,.22)', text: '#ebe3d8', solid: '#b5a694', onSolid: '#1f1a15'},
    },
  },
};

const SKIN_ALIAS: Record<string, Skin['name']> = {
  finance: 'obsidian',
  obsidian: 'obsidian',
  editorial: 'editorial',
  press: 'editorial',
  magazine: 'editorial',
  paper: 'editorial',
  cyber: 'cyber',
  terminal: 'cyber',
  tech: 'cyber',
  blueprint: 'cyber',
  vintage: 'vintage',
  desk: 'vintage',
  film: 'vintage',
  journal: 'vintage',
};

export const PAL_ORDER: Array<keyof Skin['pal']> = ['royal', 'teal', 'amber', 'crimson', 'plum', 'emerald'];

export function resolveSkinName(raw?: any): Skin['name'] {
  if (!raw) return 'obsidian';
  const k = typeof raw === 'string' ? raw : raw?.name;
  return SKIN_ALIAS[String(k || '').toLowerCase()] || 'obsidian';
}

export const ACTIVE_SKIN: Skin = SKINS[resolveSkinName((D as any).skin ?? (D as any).theme)];

export function getSkin(override?: string): Skin {
  if (!override) return ACTIVE_SKIN;
  return SKINS[resolveSkinName(override)];
}

export function getSwatch(sk: Skin, c?: string): Swatch {
  const key = (c || 'royal') as keyof Skin['pal'];
  if (sk.pal[key]) return sk.pal[key];
  const alias: Record<string, keyof Skin['pal']> = {
    gold: 'amber', yellow: 'amber', orange: 'amber',
    coral: 'crimson', red: 'crimson', rose: 'crimson',
    blue: 'royal', sky: 'royal',
    purple: 'plum', violet: 'plum',
    green: 'emerald', mint: 'teal', cyan: 'teal',
    gray: 'slate', grey: 'slate',
  };
  return sk.pal[alias[String(c || '').toLowerCase()] || 'royal'];
}

// Resolve either a palette key ('gold', 'teal', 'crimson'...) OR a raw hex color into a skin-adapted hex color
export function resolveAccent(sk: Skin, c?: string, fallbackKey: keyof Skin['pal'] = 'amber'): string {
  if (!c) return sk.pal[fallbackKey].solid;
  if (c.startsWith('#')) {
    // Remap legacy obsidian hex accents on light editorial skin for crisp contrast
    if (sk.mode === 'light') {
      const m: Record<string, string> = {
        '#f5c451': sk.pal.amber.solid,
        '#f8f56b': sk.pal.amber.solid,
        '#2fd4b5': sk.pal.teal.solid,
        '#f45d48': sk.pal.crimson.solid,
        '#4f9eff': sk.pal.royal.solid,
        '#a67cff': sk.pal.plum.solid,
        '#3dd68c': sk.pal.emerald.solid,
        '#f59e0b': sk.pal.amber.solid,
      };
      return m[c.toLowerCase()] || c;
    }
    return c;
  }
  return getSwatch(sk, c).solid;
}

// Full-canvas backdrop rendered for bg: {type: 'skin', skin?: 'editorial' | 'cyber' | 'vintage' | 'obsidian'}
export const SkinBackdrop: React.FC<{skin?: string; t?: number}> = ({skin, t = 0}) => {
  const sk = getSkin(skin);
  const gridSize = sk.name === 'editorial' ? '48px 48px' : sk.name === 'cyber' ? '44px 44px' : '32px 32px';
  const driftX = (t * 8) % 48;
  return (
    <AbsoluteFill style={{background: sk.canvasBg, overflow: 'hidden'}}>
      {sk.canvasGrid && (
        <AbsoluteFill style={{
          backgroundImage: sk.canvasGrid,
          backgroundSize: gridSize,
          backgroundPosition: `${driftX}px 0px`,
          opacity: sk.name === 'editorial' ? 0.9 : 0.7,
        }} />
      )}
      {sk.canvasGlowA && (
        <div style={{
          position: 'absolute', left: -120, top: 80, width: 760, height: 760, borderRadius: '50%',
          background: `radial-gradient(circle, ${sk.canvasGlowA} 0%, transparent 68%)`,
          pointerEvents: 'none',
        }} />
      )}
      {sk.canvasGlowB && (
        <div style={{
          position: 'absolute', right: -140, bottom: 180, width: 780, height: 780, borderRadius: '50%',
          background: `radial-gradient(circle, ${sk.canvasGlowB} 0%, transparent 68%)`,
          pointerEvents: 'none',
        }} />
      )}
      {/* Editorial top magazine rule */}
      {sk.name === 'editorial' && (
        <>
          <div style={{position: 'absolute', left: 48, right: 48, top: 58, height: 3, background: '#16161a', opacity: 0.78}} />
          <div style={{position: 'absolute', left: 48, right: 48, top: 65, height: 1, background: '#16161a', opacity: 0.35}} />
        </>
      )}
      {/* Cyber corner HUD brackets */}
      {sk.name === 'cyber' && (
        <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.45}}>
          <path d="M 36 96 L 36 46 L 86 46" fill="none" stroke="#00f0d0" strokeWidth="2.5" />
          <path d="M 1044 96 L 1044 46 L 994 46" fill="none" stroke="#00f0d0" strokeWidth="2.5" />
          <path d="M 36 1824 L 36 1874 L 86 1874" fill="none" stroke="#00f0d0" strokeWidth="2.5" />
          <path d="M 1044 1824 L 1044 1874 L 994 1874" fill="none" stroke="#00f0d0" strokeWidth="2.5" />
        </svg>
      )}
      {/* Vintage film frame border */}
      {sk.name === 'vintage' && (
        <div style={{
          position: 'absolute', inset: 28, borderRadius: 14,
          border: '1.5px solid rgba(242,222,188,.18)', pointerEvents: 'none',
        }} />
      )}
    </AbsoluteFill>
  );
};

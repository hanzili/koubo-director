"""Compare xl projects: how varied the picture is. Usage: ep_metrics.py <xl project dir>..."""
import json, os, sys, re
from collections import Counter, defaultdict

def kind_of_src(s):
    s = s or ''
    for pre, name in [('photos/', 'photo'), ('shots/', 'web'), ('logos/', 'logo'), ('props/', 'prop'),
                      ('docs/', 'doc'), ('mock', 'mock'), ('broll', 'footage'), ('clips/', 'footage')]:
        if pre in s:
            return name
    if s.endswith(('.mp4', '.mov', '.webm')):
        return 'footage'
    return 'other'

for R in sys.argv[1:]:
    D = json.load(open(os.path.join(R, 'src/data/shots.json')))
    blocks = sorted(D['blocks'], key=lambda b: b['t0'])
    T = blocks[-1]['t1'] - blocks[0]['t0']
    gfx = [b for b in blocks if b.get('scene')]
    full = sum(b['t1'] - b['t0'] for b in gfx if not b.get('aroll'))      # full-screen graphics (PiP)
    over = sum(b['t1'] - b['t0'] for b in gfx if b.get('aroll'))           # presenter + overlay
    # scene runs in time order
    runs = []
    for b in blocks:
        n = b.get('scene') or '-'
        if runs and runs[-1][0] == n:
            runs[-1][2] = b['t1']
        else:
            runs.append([n, b['t0'], b['t1']])
    scenes = D['scenes']
    # assets: first appearance and later re-appearance in a different, non-adjacent scene
    first, seen_in = {}, defaultdict(list)
    kinds = Counter(); ekinds = Counter(); bgs = Counter()
    for i, (n, a, z) in enumerate(runs):
        if n == '-':
            continue
        sc = scenes[n]
        bgs[sc['bg'].get('type')] += z - a
        for e in sc['els']:
            ekinds[e['k']] += 1
            s = e.get('src')
            if s:
                seen_in[s].append(i)
                if s not in first:
                    first[s] = e['t']; kinds[kind_of_src(s)] += 1
    replays = sum(1 for s, ix in seen_in.items() for j in range(1, len(sorted(set(ix)))) if sorted(set(ix))[j] - sorted(set(ix))[j-1] > 1)
    # longest stretch where scenes share a name stem (same board) incl. presenter strips
    stem = lambda n: re.sub(r'(_?\d+|_[a-z]$)$', '', n.replace('po_', '').replace('g_', ''))
    longest = (0, '')
    cur_s, cur_a, cur_z = None, 0, 0
    for n, a, z in runs:
        if n == '-':
            continue
        s = stem(n)
        if s == cur_s and a - cur_z < 8:
            cur_z = z
        else:
            cur_s, cur_a, cur_z = s, a, z
        if cur_z - cur_a > longest[0]:
            longest = (cur_z - cur_a, cur_s)
    nsc = len([r for r in runs if r[0] != '-'])
    # 11-24: 同屏累加 vs 整屏翻页（节奏自检：问题不在信息多，在整屏清得太快、没时间回看前文）
    gfx_runs = [(n, a, z) for n, a, z in runs if n != '-']
    gfx_durs = [z - a for _, a, z in gfx_runs]
    gfx_tot = sum(gfx_durs) or 1.0
    lt4_pct = sum(1 for d in gfx_durs if d < 4.0) / max(1, len(gfx_durs)) * 100
    ge8_pct = sum(d for d in gfx_durs if d >= 8.0) / gfx_tot * 100
    bg_seq = []
    for n, a, z in runs:
        bg = 'aroll' if n == '-' or scenes[n]['bg'].get('type', 'none') == 'none' else scenes[n]['bg'].get('type')
        if not bg_seq or bg_seq[-1] != bg:
            bg_seq.append(bg)
    bg_flips_min = (len(bg_seq) - 1) / (T / 60)
    img_dwells = []
    for n, a, z in gfx_runs:
        for e in scenes[n]['els']:
            if a - 0.5 <= e['t'] <= z and e['k'] in (
                'photo', 'webshot', 'docpage', 'prop', 'vs6', 'formula6', 'ui', 'flow6', 'graph6', 'timeline6', 'ladder', 'stack6',
                'chain_card', 'dossier_grid', 'ledger_board', 'orb_ring', 'split_bars', 'phone_chart', 'ruler_track', 'hero_pillars',
                'waffle_card', 'quote_zoom', 'question_frame', 'chapter_deck', 'top_tray', 'comic_grid', 'photo_hero', 'vs_duel',
                'map_route', 'chat_thread', 'balance_scale', 'trend_curve', 'funnel_flow', 'network_web', 'split_compare',
                'gauge_meter', 'tree_branch', 'screen_callout',
            ):
                end = min(z, e['out']) if e.get('out') else z
                img_dwells.append(max(0.0, end - max(a, e['t'])))
    img_dwell_med = sorted(img_dwells)[len(img_dwells) // 2] if img_dwells else 0.0
    print(f"== {os.path.basename(R.rstrip('/'))}  {T/60:.1f} min")
    print(f"  graphics full-screen {full/T:.0%}, presenter+overlay {over/T:.0%}, plain presenter {1-(full+over)/T:.0%}")
    print(f"  graphic segments {nsc} ({nsc/(T/60):.1f}/min); distinct scenes {len(set(r[0] for r in runs if r[0]!='-'))}")
    print(f"  canvas pacing: >=8s canvas {ge8_pct:.0f}% (want >=45%), <4s flash {lt4_pct:.0f}% (want <=25%), bg flips {bg_flips_min:.1f}/min (want <=8), img dwell med {img_dwell_med:.1f}s (want >=4.5s)")
    print(f"  distinct image assets {len(first)} ({len(first)/(T/60):.1f}/min); replays {replays}")
    print(f"  asset kinds {dict(kinds)}")
    print(f"  element kinds used {len(ekinds)}: {dict(ekinds.most_common(14))}")
    print(f"  backgrounds (s) { {k: round(v) for k, v in bgs.items()} }")
    print(f"  longest same-board stretch {longest[0]:.0f}s ({longest[1]})")

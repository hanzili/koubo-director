"""Find short black/dark flashes: frames whose dark-pixel share jumps up vs both neighbours windows (24 fps render).
--check: exit 1 if any isolated flash (<= 3 dark frames with a bright picture on both sides).
11-22 v5: 23 one-frame holes in the presenter + 2-4 empty dark frames at cuts into graphics; Hanzi: "很多地方黑屏会闪".
Usage: python3 flashscan.py <video> [--check]"""
import subprocess, sys, numpy as np
V = sys.argv[1]
W, H = 54, 96
p = subprocess.run(['ffmpeg', '-v', 'error', '-i', V, '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
f = np.frombuffer(p, np.uint8).reshape(-1, H, W).astype(np.float32)
fps = 24.0
dark = (f < 18).mean(axis=(1, 2))          # share of near-black pixels
mean = f.mean(axis=(1, 2))
n = len(f)
print('frames', n)
ev = []
for i in range(n):
    lo, hi = max(0, i - 6), min(n, i + 7)
    ctx = np.r_[dark[lo:max(lo, i - 2)], dark[min(hi, i + 3):hi]]
    if len(ctx) == 0: continue
    if dark[i] > 0.35 and dark[i] - np.median(ctx) > 0.25:
        ev.append(i)
# group runs
runs = []
for i in ev:
    if runs and i - runs[-1][1] <= 2: runs[-1][1] = i
    else: runs.append([i, i])
iso = 0
for a, b in runs:
    pre, post = mean[max(0, a - 4)], mean[min(n - 1, b + 4)]
    # isolated = dark for <= 3 frames with a bright picture on BOTH sides (a hole, not a cut to a dark scene)
    tag = ''
    # the dip itself must be really dark (v5 holes: mean 5-30); a cut from the bright presenter to a dark scene that
    # already shows its card dips to ~60-75 and is a normal cut
    if pre > 55 and post > 55 and mean[a:b + 1].min() < 45: tag = '  <-- ISOLATED FLASH'; iso += 1
    print(f'{a / fps:7.2f}s  frames {a}-{b} ({b - a + 1})  dark {dark[a:b + 1].max():.2f}  mean {mean[a:b + 1].min():.0f}  ctx mean {pre:.0f}/{post:.0f}{tag}')
print(f'isolated flashes: {iso}')
if '--check' in sys.argv: sys.exit(1 if iso else 0)

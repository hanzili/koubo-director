#!/usr/bin/env python3
"""录制页的一场 → 剪辑工程的前半段（拼素材、调音量、转写），给人判断"剪哪些"用。

用法: .venv/bin/python tools/prep_session.py work/inbox/<稿子>/<场次> [工程目录]
默认工程目录 work/<集号短名>-<场次>（如 work/ep02-20261121-180954）。写出：
  raw.mov            每段选定的那一遍按顺序拼起来，统一 1080×1920、30fps 恒定帧率、48k
                     （录制页的 webm/mp4 都是可变帧率；统一后 cut_pieces 的剪点就是准的，不要再跑 fix_edits.py）
  source.mov         整体加增益（手机网页录的声音很小，平均 -46~-48 dB）后过 prepare_source.py
  raw_transcript.json  豆包转写（稿子全文当提示）
  转写.txt           按句：起止秒 + 原话；每段素材从哪开始（段号）
  逐字.txt           每句的逐字时间（"字起-止"），写删除区间用
  底噪.json          停顿里的噪声分位数和建议的 --thr（停顿 90% 分位 + 1.5 dB，最高 -43）
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PY = str(ROOT / ".venv" / "bin" / "python")
SK = Path.home() / ".agents/skills/cangshu-koubo-wudongxiao/scripts"


def run(*a, **k):
    return subprocess.run([str(x) for x in a], check=True, **k)


def main():
    sess = Path(sys.argv[1]).resolve()
    sid, session = sess.parent.name, sess.name
    m = re.match(r"(?:script|sample)-(\d+)-", sid)
    P = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else ROOT / "work" / f"ep{m.group(1) if m else sid}-{session}"
    P.mkdir(parents=True, exist_ok=True)
    man = json.loads((sess / "manifest.json").read_text(encoding="utf-8"))
    files, starts = [], []
    for k in sorted(man["lines"], key=int):
        t = next(x for x in man["lines"][k] if x["take"] == man["chosen"][k])
        if (t.get("check") or {}).get("bad"):
            print(f"!! 段 {k} 选定的第 {t['take']} 遍画面有问题：{t['check']['bad']}")
        files.append(sess / t["file"]); starts.append((int(k), t.get("to", int(k)), (t.get("check") or {}).get("audio", 0.0)))
    (P / "raw_order.txt").write_text("\n".join(map(str, files)) + "\n", encoding="utf-8")
    # 1. 拼接：每段各自转成 30fps、竖屏、48k 立体声，再 concat（声音按时间戳补齐，避免段内漂移）
    # 注意：部分手机浏览器录屏 webm 会把竖屏人像横向拉伸存成 1920x1080（无 rotate tag）；
    # 若直接 force_original_aspect_ratio=increase,crop=1080:1920 会把人脸横向拉宽 1.78 倍！
    # 因此先探测每段宽高：当整场以竖屏为主但某段宽>高时，用 scale=1080:1920 直接还原竖屏比例。
    dims = []
    for f in files:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(f)],
            text=True,
        ).strip().split(",")
        dims.append((int(out[0]), int(out[1])) if len(out) == 2 else (1080, 1920))
    portrait_majority = sum(1 for w, h in dims if h > w) >= len(dims) / 2
    args, fc = [], ""
    for i, (f, (w, h)) in enumerate(zip(files, dims)):
        args += ["-i", str(f)]
        if portrait_majority and w > h:
            print(f"!! 段 {i+1} ({f.name}) 为横屏尺寸 {w}x{h}（疑似竖屏拉伸），自动 scale=1080:1920 还原比例")
            vfilt = f"[{i}:v]fps=30,scale=1080:1920,setsar=1,format=yuv420p[v{i}];"
        else:
            vfilt = f"[{i}:v]fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,format=yuv420p[v{i}];"
        fc += vfilt + f"[{i}:a]aresample=48000:async=1,aformat=channel_layouts=stereo[a{i}];"
    fc += "".join(f"[v{i}][a{i}]" for i in range(len(files))) + f"concat=n={len(files)}:v=1:a=1[v][a]"
    run("ffmpeg", "-v", "error", "-y", *args, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-crf", "14", "-preset", "fast", "-c:a", "pcm_s16le", P / "raw.mov")
    # 2. 增益：平均响度拉到 -30 dB 左右，峰值不超过 -1.5 dB
    vd = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(P / "raw.mov"), "-af", "volumedetect", "-vn", "-f", "null", "-"],
                        capture_output=True, text=True).stderr
    mean = float(re.search(r"mean_volume: ([-\d.]+)", vd).group(1)); peak = float(re.search(r"max_volume: ([-\d.]+)", vd).group(1))
    gain = round(max(0.0, min(-30 - mean, -1.5 - peak)), 1)
    run("ffmpeg", "-v", "error", "-y", "-i", P / "raw.mov", "-map", "0:v", "-map", "0:a", "-c:v", "copy", "-af", f"volume={gain}dB",
        "-c:a", "pcm_s16le", P / "raw_gain.mov")
    run(PY, SK / "prepare_source.py", P / "raw_gain.mov", P / "source.mov", stdout=subprocess.DEVNULL)
    (P / "raw_gain.mov").unlink()
    # 3. 转写（稿子全文当提示）
    md = ROOT / "docs" / f"{sid}.md"
    rows = re.findall(r"^\|\s*\d+\s*\|\s*(.+?)\s*\|", md.read_text(encoding="utf-8"), re.M) if md.exists() else []
    prompt = "以下是普通话口播，讲者是软萌孜神，做 FDE 的。内容：" + "".join(rows)
    run(PY, SK / "transcribe.py", P / "source.mov", P / "raw_transcript.json", "--prompt", prompt[:1500], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    segs = json.loads((P / "raw_transcript.json").read_text())["segments"]
    t, marks = 0.0, []
    for (a, b, dur) in starts:
        marks.append((round(t, 2), a, b)); t += dur
    lines = [f"# 素材分段起点（秒，按每段声音长度累加，近似）：" + "  ".join(f"{x}s=第{a}-{b}句" for x, a, b in marks)]
    lines += [f"{s['start']:7.2f}-{s['end']:7.2f} {s['text']}" for s in segs]
    (P / "转写.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (P / "逐字.txt").write_text("\n".join("# " + " ".join(f"{w['word'].strip()}{w['start']:.2f}-{w['end']:.2f}" for w in s["words"] if w["word"].strip())
                                         for s in segs) + "\n", encoding="utf-8")
    # 4. 底噪 → 建议阈值
    import numpy as np
    pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(P / "source.mov"), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                                       capture_output=True).stdout, np.float32)
    db = 20 * np.log10(np.array([np.sqrt(np.mean(pcm[i:i + 160] ** 2)) for i in range(0, len(pcm) - 160, 160)]) + 1e-9)
    W = [w for s in segs for w in s["words"] if w["start"] >= 0]
    g = [np.percentile(db[int((p["end"] + .15) * 100):int((q["start"] - .15) * 100)], 95) for p, q in zip(W, W[1:]) if q["start"] - p["end"] > 0.6]
    p50, p90 = (float(np.percentile(g, 50)), float(np.percentile(g, 90))) if g else (-55.0, -50.0)
    # 阈值贴着底噪：停顿 90% 分位 + 1.5 dB，最高 -43。11-21 第二集用 p90+5（-41）把句尾轻声字（不花、得通、对吧）当停顿收掉了；少字比停顿没收干净严重得多
    thr = int(round(min(-43, p90 + 1.5)))
    (P / "底噪.json").write_text(json.dumps({"gain_db": gain, "pause_p50": round(p50, 1), "pause_p90": round(p90, 1), "thr": thr}, ensure_ascii=False), encoding="utf-8")
    print(f"✓ {P}：{len(files)} 段，{t:.1f} 秒，增益 {gain} dB，停顿噪声 p50 {p50:.1f} / p90 {p90:.1f} dB → 建议 --thr {thr}")


if __name__ == "__main__":
    main()

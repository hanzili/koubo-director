#!/usr/bin/env python3
"""Initialize a new Koubo Director episode workspace from channel.yaml.

Zero external dependencies beyond Python 3 stdlib (parses simple YAML or JSON).
Usage:
    python3 init_channel.py --config channel.yaml --episode ep08 --title "外贸公司那条线" --out work/xl-ep08
"""
import argparse
import json
import os
import re
import shutil
import sys
from pathlib import Path

VALID_SKINS = ("obsidian", "editorial", "cyber", "vintage")
VALID_PRESETS = ("deep-explainer", "fast-take", "documentary")


def load_config(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        return json.loads(raw)
    try:
        import yaml  # type: ignore
        return yaml.safe_load(raw) or {}
    except ImportError:
        # Lightweight fallback parser for clean 2-level YAML (no external deps required)
        out: dict = {}
        stack: list[tuple[int, dict]] = [(-1, out)]
        for line in raw.splitlines():
            s = line.split("#", 1)[0].rstrip()
            if not s.strip():
                continue
            indent = len(s) - len(s.lstrip(" "))
            while len(stack) > 1 and indent <= stack[-1][0]:
                stack.pop()
            k, sep, v = s.strip().partition(":")
            if not sep:
                continue
            k, v = k.strip(), v.strip()
            cur = stack[-1][1]
            if not v:
                cur[k] = {}
                stack.append((indent, cur[k]))
            else:
                if v.startswith("[") and v.endswith("]"):
                    cur[k] = [json.loads(x.strip()) if re.match(r"^-?\d+(\.\d+)?$", x.strip()) else x.strip().strip("\"'")
                              for x in v[1:-1].split(",") if x.strip()]
                elif v.lower() in ("true", "false"):
                    cur[k] = v.lower() == "true"
                elif re.match(r"^-?\d+(\.\d+)?$", v):
                    cur[k] = float(v) if "." in v else int(v)
                else:
                    cur[k] = v.strip("\"'")
        return out


def main() -> int:
    ap = argparse.ArgumentParser(description="Scaffold a Koubo Director episode workspace from channel.yaml")
    ap.add_argument("--config", required=True, help="Path to channel.yaml (or .json)")
    ap.add_argument("--episode", required=True, help="Episode id, e.g. ep08")
    ap.add_argument("--title", default="", help="Episode title")
    ap.add_argument("--skin", default="", help=f"Override skin ({'|'.join(VALID_SKINS)})")
    ap.add_argument("--out", required=True, help="Target workspace directory")
    ap.add_argument("--dry-run", action="store_true", help="Validate config and print plan without writing")
    args = ap.parse_args()

    cfg_path = Path(args.config).resolve()
    if not cfg_path.exists():
        print(f"ERROR: config not found: {cfg_path}", file=sys.stderr)
        return 2

    cfg = load_config(cfg_path)
    vis = cfg.get("visual", {})
    dir_cfg = cfg.get("director", {})
    aud_cfg = cfg.get("audio", {})
    paths = cfg.get("paths", {})
    ch = cfg.get("channel", {})

    skin = (args.skin or vis.get("skin") or "obsidian").lower()
    if skin not in VALID_SKINS:
        print(f"ERROR: invalid skin {skin!r}; choose from {VALID_SKINS}", file=sys.stderr)
        return 2

    preset = dir_cfg.get("rhythm_preset", "deep-explainer")
    if preset not in VALID_PRESETS:
        print(f"ERROR: invalid rhythm_preset {preset!r}; choose from {VALID_PRESETS}", file=sys.stderr)
        return 2

    safe = vis.get("safe_zone", {})
    brand = vis.get("brand", {})
    project_json = {
        "episode": args.episode,
        "title": args.title or args.episode,
        "channel": ch.get("name", ""),
        "skin": skin,
        "theme": "finance" if skin == "obsidian" else skin,
        "rhythm_preset": preset,
        "pipd": safe.get("pip_diameter", 250),
        "subY": safe.get("sub_y", 1440),
        "safeZone": {"topY": safe.get("top_y", 460), "bottomY": safe.get("bottom_y", 1380)},
        "brand": {"logo": brand.get("logo", ""), "label": brand.get("label", "")},
        "audio": {
            "targetLufs": aud_cfg.get("target_lufs", -16.0),
            "musicUnderDb": aud_cfg.get("music_under_db", 19.5),
            "minDynamicsDb": aud_cfg.get("min_dynamics_db", 15.0),
        },
        "en_labels": False,
    }

    out_dir = Path(args.out).resolve()
    engine_rel = paths.get("engine_src", "engine")
    # Resolve engine_src relative to CWD or config parent
    engine_src = Path(engine_rel)
    if not engine_src.is_absolute():
        for base in (Path.cwd(), cfg_path.parent, cfg_path.parent.parent):
            cand = (base / engine_rel).resolve()
            if cand.exists():
                engine_src = cand
                break

    print(f"Channel : {ch.get('name', '(unnamed)')} [{ch.get('id', 'default')}]")
    print(f"Episode : {args.episode} — {project_json['title']}")
    print(f"Skin    : {skin} | Rhythm preset: {preset}")
    print(f"Engine  : {engine_src} ({'OK' if engine_src.exists() else 'NOT FOUND'})")
    print(f"Target  : {out_dir}")

    if args.dry_run:
        print("DRY_RUN_OK")
        return 0

    out_dir.mkdir(parents=True, exist_ok=True)
    if engine_src.exists():
        for name in ("src", "package.json", "package-lock.json", "tsconfig.json", "render.mjs", "story_core.py"):
            src_item = engine_src / name
            dst_item = out_dir / name
            if not src_item.exists():
                continue
            if src_item.is_dir():
                if dst_item.exists():
                    shutil.rmtree(dst_item)
                shutil.copytree(src_item, dst_item)
            else:
                shutil.copy2(src_item, dst_item)
        nm_src = engine_src / "node_modules"
        nm_dst = out_dir / "node_modules"
        if nm_src.exists() and not nm_dst.exists():
            os.symlink(nm_src, nm_dst)

    (out_dir / "public").mkdir(exist_ok=True)
    (out_dir / "src" / "data").mkdir(parents=True, exist_ok=True)
    (out_dir / "project.json").write_text(json.dumps(project_json, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Write a starter storyboard blueprint
    plan_md = out_dir / "storyboard_plan.md"
    if not plan_md.exists():
        plan_md.write_text(
            f"# {args.episode}｜{project_json['title']} — 画面构思单\n\n"
            f"- 视觉皮肤：`{skin}` | 节奏档位：`{preset}`\n"
            f"- 贯穿主板（全片回访 3–5 次，单次 ≤15s）：待选\n"
            f"- 真东西素材清单（目标 ≥10 张不同实拍/原件/网页）：\n"
            f"  1. \n\n"
            f"## 分段规划（动在屏内，切屏前 ≥0.6s 静止吸收）\n\n"
            f"| 时间段 | 核心观点 | 组件 | 皮肤/色板 | 真东西素材 |\n"
            f"|---|---|---|---|---|\n"
            f"| 0:00–0:15 | 开场钩子 | `photo_hero` / `vs_duel` | {skin} | |\n",
            encoding="utf-8",
        )

    print("INIT_CHANNEL_OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())

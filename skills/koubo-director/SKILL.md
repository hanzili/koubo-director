---
name: koubo-director
description: >-
  Universal AI video director & packaging skill for vertical (9:16) talking-head explainers (Xiaohongshu / Douyin /
  TikTok / Reels / YouTube Shorts). Decouples channel brand (channel.yaml), visual skin (obsidian / editorial / cyber /
  vintage), 26 progressive within-screen Remotion storytelling components, rhythm presets, and audio dynamics from any
  specific creator. Use when auditing a talking-head script, rough-cutting raw takes, designing storyboards, switching
  visual skins, rendering chunked Remotion videos, mixing dynamic music/SFX, or running pre-publish QA.
---

# Koubo Director — 通用竖屏口播导演与包装 Skill

将“脚本审校 → 粗剪清帧 → 视觉导演分镜 → 多皮肤引擎渲染 → 动态配乐混音 → 门禁验收”抽象为**四层解耦架构**，让同一套流程既能服务单个创作者长期稳定日更，也能换一份 `channel.yaml` + 一套皮肤直接复用给任何行业、任何风格的口播频道。

## 四层解耦架构

| 层 | 载体 | 职责 | 换频道时怎么变 |
|---|---|---|---|
| **L4 · 频道配置** | `channel.yaml` | 频道名、人设、片头片尾、提词器、默认皮肤、安全区、输出目录 | 改一份 40 行 YAML |
| **L3 · 视觉皮肤** | `skin_tokens.tsx` (`skin`) | 配色、材质、字体、圆角、阴影、小窗形状、字幕风格、画布底纹 | 4 套内置皮肤任选或 30 行扩第 5 套 |
| **L2 · 叙事原子** | 26 套 Remotion 组件 | 对比、占比、因果、地图、对话、漏斗、折线、原件推近、实拍窗… | 跨行业 100% 复用 |
| **L1 · 导演语法** | 本 Skill & `references/` | 动在屏内、≥0.5s 吸收停顿、主板回访、配乐 ≥15dB 起伏、硬门禁 | 按 3 档节奏预设调参 |

按需阅读参考手册（Progressive Disclosure，不一次全读）：
- 审稿与结构打磨 → `references/script-audit.md`
- 选视觉皮肤 / 定制品牌皮肤 → `references/themes-and-skins.md`
- 26 套组件选型表与参数速查 → `references/component-catalog.md`
- 节奏预设、同屏累加与音频起伏 → `references/director-grammar.md`
- 自动化质检与视觉验收门禁 → `references/quality-gates.md`

---

## 快速开工流程（新频道 / 新一集）

### 第 0 步：加载频道配置
1. 读取项目根目录的 `channel.yaml`（没有则从 `channel.example.yaml` 复制一份，或运行 `python3 scripts/init_channel.py --config channel.yaml --episode ep01 --out work/ep01` 初始化）。
2. 确认三件事：`skin`（视觉皮肤）、`rhythm_preset`（节奏档位：`deep-explainer` / `fast-take` / `documentary`）、`safe_zone`（竖屏安全带，默认 `y=460..1380`，避开右上角圆窗与底部字幕）。

### 第 1 步：先审稿，再开拍（见 `references/script-audit.md`）
- 跑 5 道硬关：体量与时长匹配、去“上课/念法条”感、行业/受众代入感、A/B/C 三级事实核查、逐段绑定画面手法。
- 原则：**稿子太啰嗦时，剪辑救不了；先砍掉教材式堆砌，再动分镜。**

### 第 2 步：粗剪与素材防护
- **畸变画面防护**：检查所有录制 take 分辨率；若竖屏会话中混入无 rotate 标签的横屏畸变文件（`w > h`），强制 `scale=1080:1920,setsar=1` 还原 1:1 人脸比例，禁止直接 center-crop 造成人脸拉宽。
- **清除触屏/切屏抬手帧**：粗剪时把每个 take 首尾伸手点屏幕、以及结尾挥手拜拜后伸手关镜的 `0.2–0.5s` 切掉；中段无法硬切的抬手动作，在分镜中用全屏组件/B-roll 覆盖。
- **音画与字幕对齐**：字幕按实说逐字生成，单行 ≤14 个中文字符。

### 第 3 步：先写构思，再写分镜（见 `references/component-catalog.md` & `references/director-grammar.md`）
1. **一段一手法，先列真东西**：先找本集 10–15 张真实照片/网页/单据，再为每段挑最贴合逻辑结构的组件（从 26 套组件字典选型，相邻段落不连用同款）。
2. **铁律 1 — 动在屏内，少换整屏**：同一组逻辑（`8–15s`）留在同一画布上逐项点亮/累加，旧信息留屏可回看；换话题才换整屏底。
3. **铁律 2 — 切屏前 ≥0.5s 静止吸收**：任何图卡的最后一个动画元素落地后，必须留足 `≥0.5–0.6s` 静止时间再切走。
4. **铁律 3 — 主板回访 + 真东西交替**：全片选 1 块贯穿主板（`ledger_board` / `chain_card` / `chapter_deck` / `split_bars`）回访 3–5 次，单次 ≤15s、累计 ≤25%，中间插真图或 `quote_zoom` / `screen_callout`。
5. **铁律 4 — 杜绝遮挡与丑模板**：
   - 所有图卡中心与高度严守安全带 `y=460..1380`（默认中心 `y=900..930, h≤900`），与右上角 PiP 及底部字幕 0 重叠；
   - 禁用白边拍立得硬贴、荧光黄对比页、满屏不可读密英文 PDF（一律改用 `photo_hero` / `vs_duel` / `quote_zoom` / `screen_callout`）。

### 第 4 步：动态配乐与音效（见 `references/director-grammar.md`）
- 按内容情绪分段写 `music_plan.json`，拉开稀疏/中等/饱满电平偏移（`-6..+4 dB`），成片疏密差 `≥15 dB`，避免拉成死直线；
- 音效克制（`3–6 个/分`），只在画面元素落地或大转折时触发；SMPTE 彩条转场 `bars` 全片最多 1–2 次。

### 第 5 步：静帧预审 → 分段渲染 → 门禁验收（见 `references/quality-gates.md`）
1. **先渲关键静帧，人工看图再全量渲染**：把所有新组件关键帧拼成一张印样，逐帧检查溢出、截断、遮挡与对比度，零瑕疵再启动全片渲染。
2. **单次打包复用渲染**：`render_chunks.sh` 先打包一次生成 `SERVE_URL`，所有分段复用（省 ~20 分钟），并开启过热/并发保护。
3. **硬门禁全绿才能交付**：
   - `ep_metrics.py` 节奏指标达标；
   - `flashscan --check` = **0 闪黑**；
   - 响度 `-16 LUFS ± 0.5`，`vocalcheck` 人声 **0 漂移**，`percue` spread **≤3 dB**；
   - 必须**亲眼检查**全片每 10 秒对照印样（`contact.jpg`）和结尾逐帧印样（`end_check.jpg`，确认无伸手关镜）。

# Koubo Director — 可分享的 AI 竖屏口播导演 Skill

一套可直接装进 **Antigravity / Claude Code / Codex** 的通用 Agent Skill，把专业竖屏知识口播（小红书 / 抖音 / 视频号 / Reels / Shorts）的**审稿、粗剪、多皮肤视觉包装、动态配乐、硬门禁验收**沉淀成标准流水线。

## 核心特点：为什么不会变成“千篇一律的模板”？

1. **视觉皮肤与组件彻底解耦（4 套内置皮肤，一行切换）**
   - `obsidian`（深海财经：暗曜石玻璃 + 宝石渐变 + 粗黑体）
   - `editorial`（暖白杂志：米白纸纹 + 墨黑硬边阴影 + 宋体大标，Vox / 纽约客质感）
   - `cyber`（极客暗黑：微网格碳黑 + 电光青 HUD 边框 + DIN 科技数字）
   - `vintage`（复古手账：胡桃暗棕 + 做旧羊皮纸 + 陶红/芥末黄暖色）
2. **26 套同屏递进叙事组件（覆盖 95% 知识/商业/科技/故事口播）**
   - 因果/台账/算账：`chain_card` `dossier_grid` `ledger_board` `orb_ring` `split_bars` `phone_chart` `ruler_track` `hero_pillars`
   - 实拍/原件/目录：`waffle_card` `quote_zoom` `question_frame` `chapter_deck` `top_tray` `comic_grid` `photo_hero` `vs_duel`
   - 地图/对话/博弈/趋势：`map_route` `chat_thread` `balance_scale` `trend_curve` `funnel_flow` `network_web` `split_compare` `gauge_meter` `tree_branch` `screen_callout`
3. **跨行业通用的导演语法 & 硬门禁**
   - 「动在屏内、少换整屏」、切屏前 `≥0.5s` 吸收停顿、粗剪清触屏伸手帧、竖屏畸变防拉宽、0 闪黑、语音 0 漂移、配乐 `≥15 dB` 疏密动态。

---

## 快速安装与使用

### 1. 安装 Skill
将整个 `skills/koubo-director/` 目录复制到你的项目或全局 Skill 目录：
- **Antigravity**：放到 `<your-repo>/.agents/skills/koubo-director/`
- **Claude Code**：放到 `~/.claude/skills/koubo-director/` 或 `<your-repo>/.claude/skills/koubo-director/`

### 2. 创建你自己的频道配置
```bash
cp skills/koubo-director/channel.example.yaml channel.yaml
# 按你的频道修改 skin (obsidian|editorial|cyber|vintage)、rhythm_preset、名称与安全区
```

### 3. 一键初始化新一集工程
```bash
python3 skills/koubo-director/scripts/init_channel.py \
  --config channel.yaml \
  --episode ep01 \
  --title "第一集标题" \
  --out work/ep01
```

### 4. 让 Agent 按 Skill 执行
直接对你的 AI Agent 说：
> “用 `koubo-director` skill 帮我审这篇稿子并按 `channel.yaml` 出片。”

---

## 目录结构

```text
koubo-director/
├── SKILL.md                    # 核心工作流与四层架构总纲
├── README.md                   # 对外分享与安装说明
├── channel.example.yaml        # 频道配置模板（复制改 10 行即用）
├── scripts/
│   └── init_channel.py         # 按 channel.yaml 初始化频道/单集工程 CLI
└── references/
    ├── themes-and-skins.md     # 4 套视觉皮肤规范 + 30 行自定义新皮肤指南
    ├── component-catalog.md    # 26 套组件选型决策表与 Props 速查
    ├── director-grammar.md     # 3 档节奏预设、同屏累加与音频动态语法
    ├── script-audit.md         # 通用 5 关审稿清单
    └── quality-gates.md        # 渲染前静帧 + 出片硬门禁验收规范
```

# 26 套叙事组件选型字典（Component Catalog）

所有 26 套组件均已接入 `skin_tokens.ts`（自动适配 `obsidian` / `editorial` / `cyber` / `vintage` 四套皮肤），且支持在单屏内逐步点亮（「动在屏内，少换整屏」）。

> **竖屏安全带硬规则**：右上角 PiP 占 `y=205..455`，底部字幕占 `y≈1440`。所有图形卡默认放 `x=540, y=900..930`，高度 `h≤900`（严格落在 `y=460..1380`），实现 0 遮挡。

## 按“正在讲什么逻辑”直接查表选组件

| 说话逻辑 / 场景 | 优先组件 (`k`) | 一句话效果 | 关键 Props |
|---|---|---|---|
| **一步推一步的因果/流程** | `chain_card` | 3D 链板 + 交替虚线弯箭头 + 暗槽逐格点亮 | `title, items:[{l, sub, t, c, img?}]` |
| **多维度盘点/清单/家底** | `dossier_grid` | 左侧色带档案卡 + 道具破框出头 + 大数值 | `title, cards:[{l, val, sub, t, c, span?, badge?}]` |
| **全片贯穿主板（多对象×多维）** | `ledger_board` | 矩阵台账，`?` 随口播翻开成 `✓/✗`/数字 | `title, cols, rows:[{l, c, cells:[{v, t, kind}]}]` |
| **并列 3–6 维度逐个点名** | `orb_ring` | 悬浮玻璃球环 + 动态聚焦/柔暗 | `orbs:[{l, sub, x, y, r, t, c, focusT, dimT}]` |
| **算利润/拆成本/破除直觉** | `split_bars` | 堆叠生长柱 + 顶部防重叠叫号条 | `title, unit, bars:[{l, segs:[{l, v, c, t}]}], callout` |
| **移动端榜单/数据/记录** | `phone_chart` | 手机机框内嵌生长柱图或逐行列表 | `title, mode:'bars'\|'list', items:[{l, v, valTxt, hi, t}]` |
| **时间线/周期/资金压期** | `ruler_track` | 物理刻度尺 + 发光滑块指针 + 里程碑浮卡 | `items:[{tick, l, sub, t, c}]` |
| **2–3 根核心原则/红线立柱** | `hero_pillars` | 磨砂玻璃竖柱 + 要点列表 + 底部道具 | `items:[{l, sub, val, pts, c, t, img?}]` |
| **占比/份额/集中度震撼** | `waffle_card` | 10×10 逐格扫填华夫格 + 巨字结论 | `title, segs:[{label, count, color, pct}], big, bigSub` |
| **法规/合同/提单/密英文原件** | `quote_zoom` | 3D 倾斜原件 → 拉平推近 + 红圈/荧光笔 + 中文大字翻译 | `src \| docLines, focusY, mark:'circle'\|'hl'\|'box', zh` |
| **抛问题 + 换真图 + 揭原因** | `question_frame` | 顶部问题框稳住 10–15s + 中窗连换真图 + 底部原因卡 | `question, clips:[{t, src, tag}], reasons:[{t, title, sub}]` |
| **第 1 关→第 2 关递进章节** | `chapter_deck` | 当前章主卡 + 已讲章节缩小停靠顶部目录排 | `cards:[{t, tag, title, sub, accent, src?}]` |
| **快速过 4–6 类对象（不挡主图）** | `top_tray` | 顶部 3 卡居中聚焦滑动托盘，下方全屏换实拍 | `items:[{t, title, sub, badge, accent}]` |
| **一口气演完一连串实操动作** | `comic_grid` | 漫画斜切 3–4 格逐格叠满 + 白底黑字动作签 | `title, panels:[{t, src, tag, sub?}]` |
| **开场钩子 / 巨字大数字 / 扉页** | `photo_hero` | 全出血杂志实拍（无白边）+ 慢推 + 巨字或竖排标题 | `src, mode:'number'\|'vertical', value, unit, kicker` |
| **强反差对比 / 旧vs新升级** | `vs_duel` | `stack` 上下对决 / `upgrade` 左右升级 / `chest` 胸前双徽 | `mode, a:{badge, title, value, sub}, b:{...}, delta` |
| **跨境航线 / 市场分布 / 地缘** | `map_route` | Natural Earth 真世界/区域地图 + 国家高亮 + 动画弧线 | `region, hi:[{id, c, label}], routes:[{from, to, tag, t}]` |
| **客户谈判 / 踩坑对话 / 邮件** | `chat_thread` | 左右气泡逐条弹出 + 高亮关键句 + 底部警示条 | `title, items:[{side, name, text, tag, hi, t}], takeaway` |
| **权衡 / 风险收益 / 筹码不对称** | `balance_scale` | 物理杠杆天平随重量落盘实时倾斜 + 结论条 | `left:{label, val, weight}, right:{...}, tipAt, verdict` |
| **周期波动 / 增长曲线 / 价格拐点** | `trend_curve` | 渐进绘制 SVG 折线/面积图 + 拐点标注针 | `xLabels, series:[{label, points, c}], callouts:[{idx, label, t}]` |
| **转化漏斗 / 层层筛选淘汰** | `funnel_flow` | 逐层收窄漏斗梯形 + 留存数值/比例 | `title, stages:[{label, val, pct, note, c, t}]` |
| **产业链 / 股权 / 人物关系网** | `network_web` | 中心-外围节点网 + 动态连线与流动脉冲点 | `nodes:[{id, label, x, y, hero, c, t}], edges:[{from, to, label}]` |
| **实物/前后/A厂vsB厂对照** | `split_compare` | 无白边双实拍分屏对照（左右或上下）+ 要点条 | `mode:'side_by_side'\|'top_bottom', left:{...}, right:{...}` |
| **风险评级 / 利润健康度 / 热度** | `gauge_meter` | 半圆仪表盘指针扫动 + 状态徽章 + 因子卡 | `value(0..100), big, status, factors:[{label, val, t}]` |
| **如果A→做X / 如果B→做Y 决策** | `tree_branch` | 根节点分叉生长为 2–3 条条件-结果路径卡 | `root:{label, sub}, branches:[{cond, label, result, c, t}]` |
| **网站/软件/后台实操标注** | `screen_callout` | 浏览器框实拍截图 + 聚光灯暗罩高亮目标框 + 底部解说 | `url, src, focus:[{x, y, w, h, label, note, t}]` |

## 绝对禁用的丑模式
- ❌ 白边拍立得 `photo()` 硬贴在纯色背景上 → 改用 `photo_hero` / `question_frame` / `split_compare` / `comic_grid`
- ❌ 荧光黄纯色块对比页 / 静态白底 PIL 密表 → 改用 `hero_pillars` / `vs_duel` / `ledger_board`
- ❌ 满屏密英文 PDF / 网页原文截图不翻译 → 改用 `quote_zoom` 或 `screen_callout`

# 视觉皮肤与品牌定制手册（Theme & Skin System）

引擎通过 [skin_tokens.tsx](../../engine/src/skin_tokens.tsx) 把**视觉外观（配色、材质、字体、圆角、阴影、小窗形状、字幕、地图海陆色、画布底纹）**与 **26 套组件叙事逻辑** 彻底拆开。

## 4 套内置视觉皮肤

在 `channel.yaml`（`visual.skin`）或 `project.json`（`"skin"`）里写一行名称即可整集换肤；单元素也可传 `skin="editorial"` 做跨风格混剪对比。

| 皮肤名 | 中文名 | 适用频道 / 调性 | 视觉特征 |
|---|---|---|---|
| `obsidian` | 深海财经（默认） | 商业分析、财经科普、制造业/供应链讲解 | 深蓝黑曜石底 + 磨砂暗玻璃 + 低饱和宝石渐变 + 圆窗金边 |
| `editorial` | 暖白杂志 | 纪录片、深度评论、人物/社会议题、法律/教育 | 暖米白纸纹 + 墨黑硬边偏移阴影 + 宋体大标 + 克莱因蓝/朱红批注 + 圆角方窗 |
| `cyber` | 极客暗黑 | AI / 编程 / 硬件拆解 / 量化科技 | 碳黑微网格 + 电光青 HUD 边框与直角折耳 + DIN 数字 + 荧光青柠强调 |
| `vintage` | 复古手账 | 创业故事、历史复盘、品牌案例、文化消费 | 深胡桃暗底 + 做旧羊皮纸卡 + 陶红/芥末黄/鼠尾草绿 + 胶片细框 |

## 如何用 30 行新增第 5 套品牌皮肤

1. 打开 `engine/src/skin_tokens.tsx`，在 `SKINS` 对象里复制任意一套皮肤作为基座。
2. 修改 6 组核心 Token：
   - `mode`: `'dark'` 或 `'light'`（浅色模式自动反转阴影与文字对比度）
   - `canvasBg` / `canvasGrid`: 竖屏全画布底色与微网格
   - `surface` / `surfaceAlt` / `borderStrong` / `radius` / `shadow`: 卡片材质与几何性格
   - `ink` / `inkSub` / `accent` / `accent2`: 文字与主辅强调色
   - `fontTitle` / `fontBody` / `fontNum`: 标题、正文、大数字字体族
   - `pal` (`royal` / `teal` / `amber` / `crimson` / `plum` / `emerald` / `slate`): 7 组语义色板
3. 在 `SKIN_ALIAS` 与 `init_channel.py` 的 `VALID_SKINS` 加入新名称即可全引擎生效，**无需修改任何组件代码**。

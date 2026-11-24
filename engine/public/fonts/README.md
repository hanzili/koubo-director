# Fonts Setup (Open-Source OFL Fonts)

Binary font files are not committed to this repository to keep the repo lightweight and respect third-party font redistribution licenses (see `LICENSES.txt`).

The engine (`engine/src/lib.tsx`) automatically falls back to system fonts if any file is missing. For the sharpest visual match across all 4 skins, place the following open-source (SIL OFL) font files into `engine/public/fonts/`:

| Filename | Font Family | Used For |
|---|---|---|
| `NotoSC.ttf` | Noto Sans SC (Variable / Bold) | Clean Chinese body & fallback headings |
| `NotoSerifSC.ttf` | Noto Serif SC (Variable / Bold) | `editorial` & `vintage` magazine headings |
| `Bebas.ttf` | Bebas Neue | Big KPI numbers (`obsidian`) |
| `DDINCond.ttf` | D-DIN Condensed | Tech / editorial numbers (`cyber`, `editorial`) |
| `Quicksand.ttf` | Quicksand | English sub-labels & badges |
| `MaShanZheng.ttf` | Ma Shan Zheng | Optional handwriting accent (`vintage`) |
| `FusionPixel12.woff2` | Fusion Pixel 12px | Optional retro pixel accent (`cyber`) |

All of the above are freely downloadable from [Google Fonts](https://fonts.google.com/) / GitHub under the SIL Open Font License (OFL).

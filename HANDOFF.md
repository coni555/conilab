# conilab — HANDOFF

> 跨对话接力点。每次大阶段完成后更新。
> 协作约束看 `CLAUDE.md`，视觉来源看 `~/.claude/projects/-Users-coni/memory/design-ref-literary-paper.md`。
> conilab 自己的设计语言（脱离 lixiaolai）在下面"创新方向"段。

## 当前状态：M0.5 雏形 + 第一轮去抄袭（可跑）

✅ 完成：

- Astro 6 + TS strict + bun + Cloudflare Pages 准备
- 设计 token：`src/styles/tokens.css`
  - 强调色 `--accent-deep: oklch(0.42 0.14 240)`（深蓝，避开 lixiaolai 朱砂 hue 255）
  - 字体栈 Source Serif 4 + Inter + JetBrains Mono + 思源宋体 fallback
  - sp/fs/lh/cjk 全套抄 lixiaolai
- 字体加载：`@fontsource/source-serif-4 + inter + jetbrains-mono` 自托管
- Layout：`src/layouts/Base.astro`（masthead + footer + skip-link）
- 组件：
  - `Mark.astro` — conilab 品牌标 + **硬币 ampersand** SVG（圆 + 斜线，4.8s tilt 动画，respects prefers-reduced-motion）
  - `Masthead.astro` — sticky 1px 描边 + paper-92% backdrop-blur + **三态语言切换器**（CSS-only）
  - `Footer.astro` — 三栏 colophon 风（含 footer-mark + footer-blurb 提到字体名）
  - `Kicker.astro` — § 段落符（mono uppercase 0.12em）
  - `ChapterHead.astro` — § 编号 + accent-deep 40×1px bar + h2 italic em
  - `ColophonCard.astro` — 报头牌（顶部 :before 邮票 + co-head + co-rule § + co-line × N）
- 首页 demo `src/pages/index.astro`：hero 4 行诗化断行 + opsz 72 + dl 元信息表 + ColophonCard + 两个 Chapter（占位 + 双语 about）
- Content schema：`src/content.config.ts`（articles 集合，强制 title/lede 中英双字段）
- 本地 dev: `cd ~/Sites/conilab && bun run dev` → http://localhost:4321/
- 类型检查通过：`bun run astro check` 0 errors

## 下一阶段（M1，建议下个对话做）

按优先级：

1. **视觉调参** — 在浏览器里看雏形，找需要调整的细节：
   - **双色 hue 是否对**：front 蓝 240 + back 铜 60 — 看实际渲染对比是否够鲜明又不打架
   - **Hero 对联式版式比例**：1fr / hairline / 1fr 中央分隔是否过窄、中央 ⊙ 位置是否过偏
   - **水印 ⊙ 的位置/透明度**：5% 是否过淡或过浓
   - **Principles 罗马小写 i/ii/iii italic 字号**是否够"实验簿"
   - 中英 hero 标题"两面读 / Read twice"是否有更好的对仗写法
   - 字体加载（思源宋体 fallback PingFang，将来加 web 子集）
2. **`/articles` 列表页 (almanac)**：5 列 grid `120/56/1fr/220/80` = date / lang-badge / title / tags / arrow，year-head 大年份 + 2px accent-deep 粗线分年
3. **单篇文章模板 `/articles/[...slug].astro`**：
   - 双语段落渲染（基于 schema 的 title_zh/en + body 中英分段）
   - pullquote 中英并置组件
   - 阅读进度条
   - 上下文：上一篇 / 下一篇
4. **第一篇文章**：你给原文（≥3000 字中文）→ 我做 zh→en 中英对照版 → 落地 `content/articles/2026-04-XX-slug.md`
5. **`/about` 页**：about-aside sticky 目录 + longform 双语正文 + pullquote
6. **RSS / sitemap**：用 `@astrojs/rss + @astrojs/sitemap`
7. **CF Pages 部署**：
   - GitHub repo（ssh remote）
   - CF Pages 连接 repo，build cmd `bun run build`，output `dist/`
   - 域名 `conilab.cn` DNS 到 CF
   - 国内 ICP 备案（注意：`conilab.cn` 是 .cn 域名，CF Pages 需要走 CN 节点或考虑用 Cloudflare China Network；如果没备案可以先用 cloudflare.com 的 *.pages.dev 子域过渡）

## 已知 / 待办

- [ ] 思源宋体 web 字体子集化（中文 web 字体太大，需要做 subsetting，未来用 `cn-font-split` 或类似工具）
- [ ] `astro check` 报 7 处 `'z' is deprecated` warning，是 Astro 6 + Zod 引用方式过渡，无影响（github.com/withastro/astro 后续版本会修）
- [ ] favicon 还是 Astro 默认，需要做 conilab 自己的（硬币 motif 衍生）
- [ ] `/articles/rss.xml` 路由还没建
- [ ] 备案号 footer 里写的是"备案号待添加"，等域名实际部署再填
- [ ] 暂未做 darkmode（lixiaolai 也没做，先不做）

## 关键决策（敲定，不要再讨论）

- 站名：conilab；域名：conilab.cn
- 内容定位：≥3000 字 + 中英对照
- 内容迁移：A（全新开始，公众号「夜识AI」与博客无关）
- 部署：Cloudflare Pages（不是 Vercel）
- 技术栈：Astro 6 + TS strict + bun + 无 React / 无 Tailwind

## 创新方向（已落地，是 conilab 区别于 lixiaolai 的核心）

**核心 motif：「硬币的两面」/ 双面叙事**

| 维度 | lixiaolai | conilab |
|---|---|---|
| 章节符号 | `§` 段落符 | `⊙` 同心双圆（`CoinGlyph` 组件，硬币最简几何） |
| 章节编号 | `01 / 02 / 03` 阿拉伯 | `Ⅰ / Ⅱ / Ⅲ` 罗马数字（实验簿味，配合 "lab" 字面）|
| 强调色 | 单色 vermillion 朱砂（实为蓝紫） | **双色制**：`--accent-front`（深蓝 240）+ `--accent-back`（暖铜 60），对应硬币正反 / 中英 / 阅读·写作 |
| Hero 版式 | 左 1.4fr 文案 + 右 1fr colophon | **对联式中英并置**：左中文（front 蓝） / 中央 hairline + ⊙ 剖面 / 右英文（back 铜） |
| Colophon | 城市地图 + DISPATCH 字样 | **试验登记卡**：左右两枚同心圆（中/en）+ 中央 ⊙ 分隔 + 右下角铜色 ⊙ 印章（半透明，hover 强化）|
| Footer 文案 | "Set in Newsreader and Inter. Built in the open. Licensed permissively..." | "Long-form notes *read twice* — once in 中文, once in English. Each piece earns its place by being ≥ 3000 字. Built quietly." |
| 装饰 | 无 | Hero 右下角超大水印 ⊙（5% 透明度，借自 design-ref-editorial 的水印叠底招式） |
| 章节 ⅡI 主题 | About / Bio | **Principles**（"What this notebook *refuses*" — 不暴露身份只列原则）|
| Principles 编号 | — | 罗马小写 `i / ii / iii` italic 铜色 |
| `CoinGlyph` 变体 | — | `ring / dot / slash / stamp` 4 种，全站统一 motif |

**身份信息：全部清除**
- 删除：真实姓名、城市、出生年、Bureau 城市列表
- 保留：网名 `@coni`、域名 `conilab.cn`、GitHub `coni555`（公开网名 ID）
- footer-bottom 描述："conilab.cn — a notebook with two faces"（无地理信息）

## 接力上下文

进度看本文件下半部"下一阶段（M1）"。

## 下一阶段（M1，建议下个对话做）

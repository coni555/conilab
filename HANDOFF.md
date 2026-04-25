# conilab — HANDOFF

> 跨对话接力点。每次大阶段完成后更新。
> 协作约束看 `CLAUDE.md`，视觉来源看 `~/.claude/projects/-Users-coni/memory/design-ref-literary-paper.md`。

## 当前状态：M0 雏形（可跑）

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

1. **视觉调参** — 在浏览器里看雏形，对照 lixiaolai.com 找 5~10 处需要调整的细节：
   - 强调色 hue 240 是否太冷？（备选：220 / 230 / 200）
   - hero-title 字号 + clamp 在你常用屏幕是否合适
   - colophon-card 的 SVG motif（双圆 + 斜线）够不够"硬币"
   - 字体加载时间是否够快（思源宋体本地有就用，没有的访客会 fallback PingFang）
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
- ampersand：硬币 SVG（圆 + 斜线），不是 lixiaolai 的 sparkles，也不是月相
- 强调色：deep blue oklch(0.42 0.14 240)，命名 `--accent-deep`（语义命名，将来 hue 调整不破坏 motif）
- 部署：Cloudflare Pages（不是 Vercel）
- 技术栈：Astro 6 + TS strict + bun + 无 React / 无 Tailwind
